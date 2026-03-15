import { Includeable, Model, ModelStatic, Order, WhereOptions } from 'sequelize';
import { MakeNullishOptional } from 'sequelize/types/utils';
import { ERROR_TYPES } from './enums';
import DbErrors from '../models/dbErrors';
import Errors from '../models/errors';

function WithTryCatchStatic(handler: (err: any, method: string, args: any[]) => void) {
	return function <T extends { new (...args: any[]): {} }>(constructor: T) {
		const staticMethods = Object.getOwnPropertyNames(constructor).filter(
			(m) => m !== 'length' && m !== 'prototype' && m !== 'name',
		);

		for (const method of staticMethods) {
			const original = (constructor as any)[method];

			if (typeof original === 'function') {
				(constructor as any)[method] = async (...args: any[]) => {
					try {
						return await original.apply(constructor, args);
					} catch (err) {
						handler(err, method, args);
						return null;
					}
				};
			}
		}
		return constructor;
	};
}

@WithTryCatchStatic((err, method, args) => {
	DBInterface.create(DbErrors, {
		func: String(method) ?? '',
		args: JSON.stringify(args['0'].tableName) + JSON.stringify(args['1']),
	});
	DBInterface.create(Errors, {
		message: err.message,
		code: ERROR_TYPES.DbErrors,
	});
})
export class DBInterface {
	static async create<T extends Model>(
		table: ModelStatic<T>,
		data: MakeNullishOptional<T['_creationAttributes']>,
		raw = true,
	): Promise<typeof raw extends true ? T['_attributes'] : T> {
		return (await table.create(data, { raw })) as typeof raw extends true ? T['_attributes'] : T;
	}

	static async getOrCreate<T extends Model>(
		table: ModelStatic<T>,
		where: WhereOptions,
		data: MakeNullishOptional<T['_creationAttributes']>,
		raw = true,
	): Promise<[T['_attributes'] | T, boolean]> {
		const instance = (await this.get(table, { conditions: where }, false)) as T | null;

		if (instance) {
			return [raw ? instance.get({ plain: true }) : instance, false];
		}

		const newInstance = await this.create(table, data, raw);
		return [newInstance, true];
	}

	static async get<T extends Model>(
		table: ModelStatic<T>,
		options: {
			tables?: {
				model: ModelStatic<any>;
				conditions?: WhereOptions;
			}[];
			conditions?: WhereOptions;
		} = {},
		raw = true,
	): Promise<typeof raw extends true ? T['_attributes'] : T | null> {
		const { tables = [], conditions } = options;

		const include = tables.map((t) => ({
			model: t.model,
			where: t.conditions as WhereOptions,
		}));

		return await table.findOne({
			where: conditions as WhereOptions,
			include,
			raw,
		});
	}

	static async all<T extends Model>(
		table: ModelStatic<T>,
		options: {
			conditions?: WhereOptions;
			limit?: number;
			offset?: number;
			sort?: [string, 'ASC' | 'DESC'][];
			include?: Includeable[];
			distinctCol?: string;
		} = {},
		raw = true,
	) {
		const { conditions, offset = 0, limit, sort = [['id', 'ASC']], include, distinctCol } = options;

		return await table.findAll({
			where: conditions,
			attributes: distinctCol ? [distinctCol] : undefined,
			group: distinctCol ? [distinctCol] : undefined,
			limit,
			offset,
			order: distinctCol ? undefined : sort,
			include,
			raw,
		});
	}

	static async update<T extends Model>(
		table: ModelStatic<T>,
		conditions: WhereOptions,
		data: Partial<T['_creationAttributes']>,
		raw = true,
	): Promise<typeof raw extends true ? T['_attributes'] : T | null> {
		const obj = await table.findOne({ where: conditions });
		if (!obj) return null;
		const updated = await obj.update(data);
		return raw ? updated.get({ plain: true }) : updated;
	}

	static async updateOrCreate<T extends Model>(
		table: ModelStatic<T>,
		conditions: WhereOptions,
		updateData: Partial<T['_creationAttributes']>,
		createData: MakeNullishOptional<T['_creationAttributes']>,
		raw = true,
	): Promise<typeof raw extends true ? T['_attributes'] : T | null> {
		const obj = await table.findOne({
			where: conditions,
		});
		if (obj) {
			const updated = await obj.update(updateData);
			return raw ? updated.get({ plain: true }) : updated;
		} else {
			const created = await table.create(createData);
			return raw ? created.get({ plain: true }) : created;
		}
	}

	static async delete<T extends Model>(
		table: ModelStatic<T>,
		conditions: WhereOptions,
	): Promise<boolean> {
		const count = await table.destroy({
			where: conditions as WhereOptions,
		});
		return count > 0;
	}
}
