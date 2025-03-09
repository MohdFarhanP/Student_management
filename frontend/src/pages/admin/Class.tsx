import UserTable from '../../components/UserTable';
import { CiCirclePlus } from "react-icons/ci";

const Class = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Classes </h1>
      <div className='flex justify-end mr-20 pb-1'>
        <button className="btn btn-primary btn-sm">Add Classes <CiCirclePlus /></button>
      </div>
      <UserTable />
      <div className="join flex sm:justify-end pt-2 mr-20">
        <button className="join-item btn btn-outline btn-sm">Previous page</button>
        <button className="join-item btn btn-outline btn-sm">Next</button>
      </div>
      <h1 className="text-2xl font-bold">Subjects</h1>
    </div>
  );
};

export default Class;
