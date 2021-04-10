import Head from 'next/head';
import Image from 'next/image';
import { connectToDatabase } from '../util/mongodb';

export default function Home({ properties }) {
  console.log(properties);

  const book = async (property) => {
    const data = await fetch(
      `http://localhost:3000/api/book?property_id=${property._id}&guest=Jackson`
    );

    const res = await data.json();

    console.log(res);
  };

  return (
    <div>
      <Head>
        <title>Next mongo</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div>
        {properties &&
          properties.map((property, idx) => (
            <div key={idx}>
              <img src={property.image} />
              <div>{property.name}</div>
              <div>{property.price}</div>
              {property.summary}
              <button onClick={() => book(property)}>Book</button>
            </div>
          ))}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { db } = await connectToDatabase();

  const data = await db
    .collection('listingsAndReviews')
    .find({})
    .limit(20)
    .toArray();

  const properties = JSON.parse(JSON.stringify(data));

  const filtered = properties.map((property) => {
    const price = JSON.parse(JSON.stringify(property.price));
    return {
      _id: property._id,
      name: property.name,
      price: price.$numberDecimal,
      image: property.images.picture_url,
      summary: property.summary,
    };
  });

  return {
    props: { properties: filtered },
  };
}
