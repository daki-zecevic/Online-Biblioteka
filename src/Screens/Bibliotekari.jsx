import React, { useState } from 'react';
import { MoreVertical, Search } from 'lucide-react';

export default function Bibliotekari() {
  const [searchTerm, setSearchTerm] = useState('');

  const bibliotekari = [
    {
      id: 1,
      ime: 'Valentina Kascelan',
      email: 'valentina.kascelan@domain.net',
      tip: 'Bibliotekar',
      pristup: 'Prije 10 sati',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
      id: 2,
      ime: 'Tarik Zaimovic',
      email: 'tarik.zaimovic@domain.net',
      tip: 'Bibliotekar',
      pristup: 'Prije 2 dana',
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
    },
    {
      id: 3,
      ime: 'Test Akontacijevic',
      email: 'test.akontijevic@domain.net',
      tip: 'Bibliotekar',
      pristup: 'Nije se nikad ulogovao',
      avatar: 'https://randomuser.me/api/portraits/men/15.jpg',
    },
    {
      id: 4,
      ime: 'Darko Kascelan',
      email: 'darko.kascelan@domain.net',
      tip: 'Bibliotekar',
      pristup: 'Prije 2 nedelje',
      avatar: 'https://randomuser.me/api/portraits/men/16.jpg',
    },
    {
      id: 5,
      ime: 'Marko Markovic',
      email: 'marko.markovic@domain.net',
      tip: 'Bibliotekar',
      pristup: 'Prije 3 dana',
      avatar: 'https://randomuser.me/api/portraits/men/17.jpg',
    },
  ];

  const filtered = bibliotekari.filter((b) =>
    b.ime.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium">
          + NOVI BIBLIOTEKAR
        </button>
        <div className="flex items-center border border-gray-300 rounded px-2 py-1">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="ml-2 outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left text-gray-700">
            <tr>
              <th className="p-3">
                <input type="checkbox" />
              </th>
              <th className="p-3">Ime i prezime ⬇</th>
              <th className="p-3">Email</th>
              <th className="p-3">Tip korisnika</th>
              <th className="p-3">Zadnji pristup sistemu</th>
              <th className="p-3 text-right">...</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <input type="checkbox" />
                </td>
                <td className="p-3 flex items-center gap-2">
                  <img
                    src={b.avatar}
                    alt={b.ime}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  {b.ime}
                </td>
                <td className="p-3">{b.email}</td>
                <td className="p-3">{b.tip}</td>
                <td className="p-3">{b.pristup}</td>
                <td className="p-3 text-right">
                  <MoreVertical className="w-4 h-4 text-gray-500 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination - dummy prikaz */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <div>Rows per page: 
          <select className="ml-2 border rounded p-1 text-sm">
            <option>20</option>
            <option>50</option>
            <option>100</option>
          </select>
        </div>
        <div>
          1 of 1
          <button className="ml-4 px-2 text-gray-400" disabled>{'<'}</button>
          <button className="ml-2 px-2 text-gray-600">{'>'}</button>
        </div>
      </div>
    </div>
  );
}
