// pages/api/events/index.js
import pool, { initializeDb } from '../../../lib/db';
import { validateEvent } from '../../../lib/validation';
import { fromZonedTime, toDate } from 'date-fns-tz';

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Получить список событий
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Сортировка событий
 *       - in: query
 *         name: range
 *         schema:
 *           type: string
 *         description: Диапазон событий
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Фильтр событий
 *     responses:
 *       200:
 *         description: Список событий
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *   post:
 *     summary: Создать новое событие
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               date_periods:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     start:
 *                       type: string
 *                     end:
 *                       type: string
 *               venue:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   timezone:
 *                     type: string
 *               thumbnail:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Событие создано
 *       400:
 *         description: Ошибка валидации
 */

export default async function handler(req, res) {
  await initializeDb();

  if (req.method === 'GET') {
    const { sort, range, filter } = req.query;
    let query = 'SELECT * FROM events';
    const values = [];

    if (filter) {
      const filters = JSON.parse(filter);
      if (filters.id) {
        query += ' WHERE id = ANY($1)';
        values.push(filters.id);
      }
    }

    if (sort) {
      const [column, order] = JSON.parse(sort);
      query += ` ORDER BY ${column} ${order}`;
    }

    if (range) {
      const [start, end] = JSON.parse(range);
      query += ` LIMIT ${end - start + 1} OFFSET ${start}`;
    }

    try {
      const { rows } = await pool.query(query, values);
      res.status(200).json(rows);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
      res.status(500).json({ error: 'Ошибка при получении данных' });
    }
  } else if (req.method === 'POST') {
    const { name, description, date_periods, venue, thumbnail, status } = req.body;
    try {
      await validateEvent(req.body);

      // Преобразование каждого периода в UTC
      const utcDatePeriods = date_periods.map(period => ({
        start: toDate(fromZonedTime(new Date(period.start), venue.timezone)),  // Преобразуем в UTC
        end: toDate(fromZonedTime(new Date(period.end), venue.timezone)),      // Преобразуем в UTC
      }));

      const result = await pool.query(
        'INSERT INTO events (name, description, date_periods, venue, thumbnail, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name, description, JSON.stringify(utcDatePeriods), JSON.stringify(venue), thumbnail, status]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Ошибка при обработке запроса:', error);
      res.status(400).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Метод ${req.method} не разрешен`);
  }
}
