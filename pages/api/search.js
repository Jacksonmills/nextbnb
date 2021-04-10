import { connectToDatabase } from '../../util/mongodb';

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  const data = await db
    .collection('listingsAndReviews')
    .aggregate([
      {
        $search: {
          search: {
            query: req.query.term,
            path: ['name', 'description'],
          },
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
        },
      },
      {
        $limit: 10,
      },
    ])
    .toArray();

  res.json(data);
}
