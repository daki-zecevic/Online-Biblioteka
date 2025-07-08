import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../Styles/UcenikDetails.css';  

const dummyData = [
  {
    id: 1,
    name: 'Mika Milic',
    email: 'mika.milic@domain.net',
    type: 'Ucenik',
    lastAccess: 'Prije 10 sati',
    avatar: 'https://i.pravatar.cc/40?img=47',
  },
  {
    id: 2,
    name: 'Pero Perovic',
    email: 'pero.perovic@domain.net',
    type: 'Ucenik',
    lastAccess: 'Prije 2 dana',
    avatar: 'https://i.pravatar.cc/40?img=53',
  },
  {
    id: 3,
    name: 'Zaim Zaimovic',
    email: 'zaim.zaimovic@domain.net',
    type: 'Ucenik',
    lastAccess: 'Nije se nikad ulogovao',
    avatar: 'https://i.pravatar.cc/40?img=58',
  },
  {
    id: 4,
    name: 'Nikola Nikolic',
    email: 'nikola.nikolic@domain.net',
    type: 'Ucenik',
    lastAccess: 'Prije 2 nedelje',
    avatar: 'https://i.pravatar.cc/40?img=52',
  },
  {
    id: 5,
    name: 'Marijana Marijanov',
    email: 'marijana.marijanov@domain.net',
    type: 'Ucenik',
    lastAccess: 'Prije 3 dana',
    avatar: 'https://i.pravatar.cc/40?img=48',
  },
];

const UcenikDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = dummyData.find(u => u.id === parseInt(id));

  if (!user) {
    return <div>Ucenik nije pronađen.</div>;
  }

return (
  <div className="no-scroll-container">
    <div className="container">
      <button onClick={() => navigate(-1)}>← Nazad</button>
      <h2>Detalji učenika</h2>
      <img src={user.avatar} alt={user.name} />
      <div className="detail-row"><strong>Ime i prezime:</strong> {user.name}</div>
      <div className="detail-row"><strong>Email:</strong> {user.email}</div>
      <div className="detail-row"><strong>Tip korisnika:</strong> {user.type}</div>
      <div className="detail-row"><strong>Zadnji pristup:</strong> {user.lastAccess}</div>
    </div>
  </div>
);
}

export default UcenikDetails;
