'use strict';
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION get_game_limits_by_currency(
      p_game_id BIGINT,
      p_currency TEXT,
      p_deviation NUMERIC DEFAULT 0.10
    )
    RETURNS TABLE (
      min_limit NUMERIC,
      max_limit NUMERIC
    )
    LANGUAGE plpgsql
    AS $$
    DECLARE
      rate NUMERIC;
      raw_min NUMERIC;
      raw_max NUMERIC;
      min_allowed NUMERIC;
      max_allowed NUMERIC;
    BEGIN
      SELECT rate INTO rate
      FROM currencies
      WHERE code = p_currency;

      IF rate IS NULL THEN
        RAISE EXCEPTION 'Currency % not found', p_currency;
      END IF;

      SELECT
        g.min_limit_usd * rate,
        g.max_limit_usd * rate
      INTO raw_min, raw_max
      FROM games g
      WHERE g.id = p_game_id;

      min_allowed := raw_min * (1 - p_deviation);
      max_allowed := raw_max * (1 + p_deviation);

      min_limit := CEIL(raw_min);
      max_limit := FLOOR(raw_max);

      IF min_limit < min_allowed THEN
        min_limit := CEIL(min_allowed);
      END IF;

      IF max_limit > max_allowed THEN
        max_limit := FLOOR(max_allowed);
      END IF;

      RETURN NEXT;
    END;
    $$;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS get_game_limits_by_currency(
        BIGINT, TEXT, NUMERIC
      );
    `);
  }
};
