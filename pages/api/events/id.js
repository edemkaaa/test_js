   // pages/api/events/[id].js
   import pool from '../../../lib/db';
   import { validateEvent } from '../../../lib/validation';
      /**
    * @swagger
    * /api/events/{id}:
    *   get:
    *     summary: Получить событие по ID
    *     parameters:
    *       - in: path
    *         name: id
    *         required: true
    *         schema:
    *           type: integer
    *         description: ID события
    *     responses:
    *       200:
    *         description: Событие найдено
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *       404:
    *         description: Событие не найдено
    *   put:
    *     summary: Обновить событие
    *     parameters:
    *       - in: path
    *         name: id
    *         required: true
    *         schema:
    *           type: integer
    *         description: ID события
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
    *       200:
    *         description: Событие обновлено
    *       404:
    *         description: Событие не найдено
    *   delete:
    *     summary: Удалить событие
    *     parameters:
    *       - in: path
    *         name: id
    *         required: true
    *         schema:
    *           type: integer
    *         description: ID события
    *     responses:
    *       200:
    *         description: Событие удалено
    *       404:
    *         description: Событие не найдено
    */


   export default async function handler(req, res) {
     const { id } = req.query;

     if (req.method === 'GET') {
       try {
         const { rows } = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
         if (rows.length === 0) {
           return res.status(404).json({ error: 'Событие не найдено' });
         }
         res.status(200).json(rows[0]);
       } catch (error) {
         res.status(500).json({ error: 'Ошибка при получении события' });
       }
     } else if (req.method === 'PUT') {
       const { name, description, date_periods, venue, thumbnail, status } = req.body;
       try {
         const result = await pool.query(
           'UPDATE events SET name = $1, description = $2, date_periods = $3, venue = $4, thumbnail = $5, status = $6 WHERE id = $7 RETURNING *',
           [name, description, JSON.stringify(date_periods), JSON.stringify(venue), thumbnail, status, id]
         );
         if (result.rows.length === 0) {
           return res.status(404).json({ error: 'Событие не найдено' });
         }
         res.status(200).json(result.rows[0]);
       } catch (error) {
         res.status(400).json({ error: error.message });
       }
     } else if (req.method === 'DELETE') {
       try {
         const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
         if (result.rows.length === 0) {
           return res.status(404).json({ error: 'Событие не найдено' });
         }
         res.status(200).json({ message: 'Событие удалено' });
       } catch (error) {
         res.status(500).json({ error: 'Ошибка при удалении события' });
       }
     } else {
       res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
       res.status(405).end(`Метод ${req.method} не разрешен`);
     }
   }