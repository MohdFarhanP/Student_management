import React from 'react';

const UserTable: React.FC = () => {
  return (
    <>
      <div className='flex justify-end mr-20 pb-1'>
        <button className="btn btn-primary btn-sm">Add Classes</button>
      </div>
      <div className="relative mx-auto max-w-4xl overflow-x-auto shadow-md sm:rounded-lg">
        {/* Table */}
        <table className="w-full text-left text-xs text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase dark:bg-gray-700 dark:text-gray-400">
            <tr className="pb-4">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                name: 'Neil Sims',
                email: 'neil.sims@flowbite.com',
                position: 'React Developer',
                status: 'Online',
                img: '/docs/images/people/profile-picture-1.jpg',
              },
              {
                name: 'Bonnie Green',
                email: 'bonnie@flowbite.com',
                position: 'Designer',
                status: 'Online',
                img: '/docs/images/people/profile-picture-3.jpg',
              },
              {
                name: 'Jese Leos',
                email: 'jese@flowbite.com',
                position: 'Vue JS Developer',
                status: 'Online',
                img: '/docs/images/people/profile-picture-2.jpg',
              },
              {
                name: 'Thomas Lean',
                email: 'thomes@flowbite.com',
                position: 'UI/UX Engineer',
                status: 'Online',
                img: '/docs/images/people/profile-picture-5.jpg',
              },
              {
                name: 'Leslie Livingston',
                email: 'leslie@flowbite.com',
                position: 'SEO Specialist',
                status: 'Offline',
                img: '/docs/images/people/profile-picture-4.jpg',
              },
            ].map((user, index) => (
              <tr
                key={index}
                className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
              >
                <td className="flex items-center px-4 py-2">
                  <div className="font-semibold">{user.name}</div>
                </td>
                <td className="px-4 py-2">{user.position}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center">
                    <span
                      className={`h-2 w-2 rounded-full ${user.status === 'Online' ? 'bg-green-500' : 'bg-red-500'} mr-1`}
                    />
                    {user.status}
                  </div>
                </td>
                <td className="px-4 py-2">
                  <a href="#" className="text-blue-600 hover:underline">
                    Edit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="join flex sm:justify-end pt-2 mr-20">
        <button className="join-item btn btn-outline btn-sm">Previous page</button>
        <button className="join-item btn btn-outline btn-sm">Next</button>
      </div>
    </>
  );
};

export default UserTable;
