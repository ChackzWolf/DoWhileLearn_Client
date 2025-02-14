import Spinner from "../../../common/icons/Spinner";

export const DashboardCard = ({ title, value, icon: Icon, discription }:{ title:string, value:any, icon:any, discription:string}) => (
  <div className="bg-gradient-to-br from-purple-500 to-[#6211cd] rounded-xl p-6 text-white transform transition-all hover:scale-105">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-purple-100">{title}</p>
      {value === null ? <Spinner/>:<h3 className="text-3xl font-bold">{value}</h3>}
    </div>
    <Icon className="w-12 h-12 opacity-80" />
  </div>
  <div className="mt-4 text-purple-100">
    {discription}
  </div>
</div>
  );