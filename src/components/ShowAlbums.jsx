import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ShowAlbums = () => {
  const { id } = useParams();
  const [photos, setPhotos] = useState([]);
  console.log(photos);
  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${id}`)
      .then((response) => response.json())
      .then((data) => setPhotos(data));
  }, [id]);

  return (
    <div className="w-[900px] m-auto flex flex-wrap gap-4">
      {photos.map((e) => (
        <img
          src={e.url}
          alt="img"
          className="h-[200px] w-[200px] object-cover"
          key={e.id}
        />
      ))}
    </div>
  );
};

export default ShowAlbums;
