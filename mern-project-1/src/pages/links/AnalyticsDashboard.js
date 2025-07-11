import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { serverEndpoint } from "../../config/config";                    //-------
import { DataGrid } from '@mui/x-data-grid';
import { Bar, Pie } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
   Chart as ChartJS,
   BarElement,
   CategoryScale,
   LinearScale,
   ArcElement,
   Tooltip,
   Legend,
   Title
} from 'chart.js';

ChartJS.register(
   BarElement,
   CategoryScale,
   LinearScale,
   ArcElement,
   Tooltip,
   Legend,
   Title
);

const formatDate = (isoDateString) => {
   if (!isoDateString) return '';

   try {
       const date = new Date(isoDateString);

       // July 10, 2025
       return new Intl.DateTimeFormat('en-US', {
           year: 'numeric',
           month: 'long',
           day: 'numeric'
       }).format(date);
   } catch (error) {
       console.log(error);
       return '';
   }
};

function AnalyticsDashboard() {
   const { id } = useParams();
   const navigate = useNavigate();
   const [analyticsData, setAnalyticsData] = useState([]);
   const [fromDate, setFromDate] = useState(null);
   const [toDate, setToDate] = useState(null);

   const fetchAnalytics = async () => {
       try {
           const response = await axios.get(`${serverEndpoint}/links/analytics`, {
               params: {
                   linkId: id,
                   from: fromDate,
                   to: toDate
               },
               withCredentials: true
           });
         
           setAnalyticsData(response.data);
       } catch (error) {
           console.log(error);
           navigate('/error');
       }
   };

   const groupBy = (key) => {
       return analyticsData.reduce((acc, item) => {
           const label = item[key] || 'unknown';
           acc[label] = (acc[label] || 0) + 1;
           return acc;
       }, {});
   };

   const clicksByCity = groupBy('city');
   const clicksByBrowser = groupBy('browser');

   const columns = [
       { field: 'ip', headerName: 'IP Address', flex: 1 },
       { field: 'city', headerName: 'City', flex: 1 },
       { field: 'country', headerName: 'Country', flex: 1 },
       { field: 'region', headerName: 'Region', flex: 1 },
       { field: 'isp', headerName: 'ISP', flex: 1 },
       { field: 'deviceType', headerName: 'Device', flex: 1 },
       { field: 'browser', headerName: 'Browser', flex: 1 },
       {
           field: 'clickedAt',
           headerName: 'Clicked At',
           flex: 1,
           renderCell: (params) => (
               <>{formatDate(params.row.clickedAt)}</>
           )
       },
   ];

   useEffect(() => {
       fetchAnalytics();
   }, [fromDate, toDate]);

   return (
       <div className="container py-5">
           <h1>Analytics for LinkID: {id}</h1>

           <div className="row mb-4 mx-0 border py-3 border">
               <h5>Filters:</h5>
               <div className="col-md-2">
                   <DatePicker
                       selected={fromDate}
                       onChange={(date) => setFromDate(date)}
                       className="form-control"
                       placeholderText="From (Date)"
                   />
               </div>
               <div className="col-md-2">
                   <DatePicker
                       selected={toDate}
                       onChange={(date) => setToDate(date)}
                       className="form-control"
                       placeholderText="To (Date)"
                   />
               </div>
           </div>

           <div className="row mb-4 mx-0 border py-3 rounded">
               <div className="col-md-8 p-3 rounded mt-2">
                   <h5>Clicks by City</h5>
                   <hr />
                   <Bar
                       data={{
                           labels: Object.keys(clicksByCity),
                           datasets: [
                               {
                                   label: 'Clicks',
                                   data: Object.values(clicksByCity),
                                   backgroundColor: 'rgba(54, 162, 235, 0.6)',
                               }
                           ]
                       }}
                       options={{ responsive: true }}
                   />
               </div>

               <div className="col-md-4 p-3 rounded mt-2">
                   <h5>Clicks by Browser</h5>
                   <hr />
                   <Pie
                       data={{
                           labels: Object.keys(clicksByBrowser),
                           datasets: [
                               {
                                   data: Object.values(clicksByCity),
                                   backgroundColor: [
                                       '#FF6384',
                                       '#36A2EB',
                                       '#FFCE56',
                                       '#4BC0C0',
                                       '#9966FF',
                                       '#FF9F40',
                                   ],
                               }
                           ]
                       }}
                       options={{ responsive: true }}
                   />
               </div>
           </div>

           <DataGrid
               getRowId={(row) => row._id}
               rows={analyticsData}
               columns={columns}
               initialState={{
                   pagination: {
                       paginationModel: { pageSize: 20, page: 0 }
                   }
               }}
               pageSizeOptions={[20, 50, 100]}
               disableRowSelectionOnClick
               showToolbar
               sx={{
                   fontFamily: 'inherit'
               }}
           />
       </div>
   );
}

export default AnalyticsDashboard;




















// import { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { serverEndpoint } from '../../config/config';
// import axios from 'axios';
// import { DataGrid } from '@mui/x-data-grid';
// import {Bar,Pie} from 'react-chartjs-2';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css'
// import {
//     Chart as ChartJS,
//     BarElement,
//     CategoryScale,
//     LinearScale,
//     ArcElement,
//     Tooltip,
//     Legend,
//     Title

// } from 'chart.js';

// ChartJS.register(
//     BarElement,
//     CategoryScale,
//     LinearScale,
//     ArcElement,
//     Tooltip,
//     Legend,
//     Title
// );


// const formatDate=(isoDateString)=>{
//     if(!isoDateString) return '';

//     try{
//         const date = new Date (isoDateString);

//         //july 10, 2025

//         return new Intl.DateTimeFormat('en-us',{
//             year:'numeric',
//             month:'long',
//             day:'numeric'
//         }).format(date);

//     }catch(err){
//         console.log(err);
//         return'';
//     }
// }

// function AnalyticsDashboard() {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [analyticsData, setanalyticsData] = useState([]);
//     const [fromDate, setFromDate] = useState(null);
//     const [toDate, setToDate] = useState(null);

//     const fetchAnalytics = async () => {
//         try {

//             const response = await axios.get(`${serverEndpoint}/links/analytics`, {
//                 params: {
//                     linkID: id,
//                     from: fromDate,
//                     to: toDate
//                 },
//                 withCredentials:true
//             });
//             setanalyticsData(response.data);
//             console.log(response.data);

//         } catch (error) {
//             console.log(error);
//             navigate('/error')
//         }

//     };

//     // we are makeing this group for making the graph and charts
//     const groupBy=(key)=>{             // grouping the item with acc and one by one we are searching for that label and if it exixts then start adding +1
//         return analyticsData.reduce((acc,item)=>{
//             const label = item[key] || "unknown";
//             acc[label]=(acc[label]||0)+1;
//             return acc;

//         },{});
//     };

//     const clicksByCity= groupBy('city')
//     const clicksByBrowser = groupBy('browser')

//     ///----------------------------------------------------now we are going to create the table
//     //----------------------------------------------------------------------stating with the table

//     const columns=[
//          {field:'ip',headerName:'ip Address',flex:1},
//          {field:'city',headerName:' City',flex:1},
//          {field:'country',headerName:'Country',flex:1},
//          {field:'region',headerName:'Region',flex:1},
//          {field:'isp',headerName:'ISP',flex:1},
//          {field:'deviceType',headerName:'Device',flex:1},
//          {field:'browser',headerName:'Browesr',flex:1},
//          {
//             field:'clickedAt',headerName:'Clicked At',flex:1,renderCell:(params)=>{
//                 <>
//                 {formatDate(params.row.clickedAt)}
//                 </>
//             }
//         },

//     ];

//     useEffect(() => {
//         fetchAnalytics();
//     }, [fromDate,toDate])
//     return (
//         <>
//             <div className="container py-5">
//                  <h1>AnalyticsDashboard{id}</h1>
//                  <div className="row nb-4 mx-0 border py-3 border">

//                     <h5>Filters:</h5>
//                     <div className='col-md-2'>
//                         <DatePicker
//                            selected={fromDate}
//                            onChange={(date)=>setFromDate(date)}
//                            className="form-control"
//                            placeholderText="From (Date)"
//                         />

//                     </div>
//                     <div className='col-md-2'>
//                         <DatePicker
//                            selected={toDate}
//                            onChange={(date)=>setToDate(date)}
//                            className="form-control"
//                            placeholderText="To (Date)"
//                         />

//                     </div>
//                  </div>
                 
//                 <div className="row mb-4 mx-0 border py-3 rounded">
//                     <div className="col-md-8 p-3 rounded mt-2">
//                         <h5>Clciks by City </h5>
//                         <hr/>
//                         <Bar
//                             data={{
//                                 labels:Object.keys(clicksByCity),
//                                 datasets:[
//                                     {
//                                         label:'Clciks',
//                                         date:Object.values(clicksByCity),
//                                         backgroundColor:'rgba(54,162,235,0.6)',
//                                     }
//                                 ]
//                             }}
//                             options={{responsive:true}}
//                         />
                        
//                     </div>
//                     <div className="col-md-4 p-3 rounded mt-2">
//                         <h5>Clicks by Browser</h5>
//                         <hr/>
//                         <Pie
//                         data={{
//                             labels: Object.keys(clicksByBrowser),
//                             datasets:[
//                                 {
//                                     data:Object.values(clicksByCity),
//                                     backgroundColor:[
//                                         '#FF6384',
//                                         '#36A2EB',,
//                                         '#FFCE56',
//                                         '#4BC0C0',
//                                         '#9966FF',
//                                         '#FF9F40',

//                                     ],

//                                 }
//                             ]
//                         }}
//                         options={{responsive:true}}
//                         />
//                     </div>
//                 </div>



//                  <DataGrid
//                     getRowId={(row)=>row._id}
//                     rows={analyticsData}
//                     columns={columns}
//                     initialState={{
//                         pagination:{
//                             gridPaginationModel:{pageSize:20,page:0}
//                         }
//                     }}
//                     pageSizeOptions={[20,30,50]}
//                     disableRowSelectionOnClick
//                     showToolbar
//                     sx={{
//                         fontFamily:'inherit'
//                     }}
                
//                  />
//             </div>
//         </>
//     )
// }

// export default AnalyticsDashboard;