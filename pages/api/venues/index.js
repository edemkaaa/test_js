import pool from '../../../lib/db';

/**
 * @swagger
 * /api/venues:
 *   get:
 *     summary: Получить список мест проведения
 *     parameters:
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Фильтр мест проведения
 *     responses:
 *       200:
 *         description: Список мест проведения
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { filter } = req.query;
    let query = 'SELECT * FROM venues';
    const values = [];

    if (filter) {
      const filters = JSON.parse(filter);
      if (filters.event_id) {
        query += ' WHERE event_id = $1';
        values.push(filters.event_id);
      }
    }

    try {
      const { rows } = await pool.query(query, values);
      res.status(200).json(rows);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
      res.status(500).json({ error: 'Ошибка при получении данных' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Метод ${req.method} не разрешен`);
  }
}