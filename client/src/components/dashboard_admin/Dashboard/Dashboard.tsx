import users from "../../../assets/dashboard_admin/users-young.png";
import stock from "../../../assets/dashboard_admin/stock.png";
import money from "../../../assets/dashboard_admin/money.png";
import { Card, CardContent, CardHeader } from "@mui/material";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ComposedChart,
  Area,
  Bar,
  AreaChart,
  ResponsiveContainer,
} from "recharts";
import { useDashboard } from "./hook/useDashboard";

export const Dashboard = () => {
  const [
    usersCount,
    productsCount,
    purchasesCount,
    CategoryQuantity,
    COLORS,
    payments,
  ]: any = useDashboard();

  return (
    <Card className='main'>
      <CardHeader title='Welcome to the administration' />
      <CardContent className='dashboardAdmin_wrapper'>
        <Card variant='outlined' className='dashboardAdmin_card'>
          <div className='dashboardAdmin_icon'>
            {/* <UserIcon /> */}
            <img src={users} />
          </div>
          <h2>Users registered</h2>
          <p>{usersCount}</p>
        </Card>

        <Card variant='outlined' className='dashboardAdmin_card'>
          <div className='dashboardAdmin_icon'>
            {/* <LocalGroceryStoreIcon /> */}
            <img src={stock} />
          </div>
          <h2>Products</h2>
          <p> {productsCount}</p>
        </Card>

        <Card variant='outlined' className='dashboardAdmin_card'>
          <div className='dashboardAdmin_icon'>
            {/* <PaidIcon /> */}
            <img src={money} />
          </div>
          <h2>Purchases</h2>
          <p>{purchasesCount}</p>
        </Card>
      </CardContent>

      <div className='main_graphics'>
        <div className='PieChart'>
          <ResponsiveContainer>
            <ComposedChart data={payments}>
              <XAxis dataKey='date' />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid stroke='#f5f5f5' />
              <Bar dataKey='TotalSales' barSize={20} fill='#413ea0' />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className='ComposedChart'>
          <ResponsiveContainer>
            <PieChart className='PieChart_graphic'>
                <Pie
                  data={CategoryQuantity}
                  fill='#8884d8'
                  dataKey='quantity'
                  className='pie'
                >
                  {CategoryQuantity.map((entry: any, index: any) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  align='right'
                  layout='vertical'
                  verticalAlign='middle'
                />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className='AreaChart'>
          <ResponsiveContainer>
            <AreaChart data={payments}>
              <CartesianGrid strokeDasharray='8 8' />
              <XAxis dataKey='date' />
              <YAxis />
              <Tooltip />
              <Area
                type='monotone'
                dataKey='TotalCount'
                stroke='#8884d8'
                fill='#8884d8'
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
