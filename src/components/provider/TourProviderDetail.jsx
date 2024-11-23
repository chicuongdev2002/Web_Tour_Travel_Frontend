import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import NavHeader from "../navbar/NavHeader";

const TourProviderDetail = () => {
  const [userData, setUserData] = useState([]);
  const [tourTypeData, setTourTypeData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [revenueUser, setRevenueUser] = useState([]);

  useEffect(() => {
    const fetchTourData = async () => {
      const user = sessionStorage.getItem("user"); // Retrieve userId from session
      const userId = JSON.parse(user).userId;
      try {
        const response = await axios.get(
          `http://localhost:8080/api/tours/count-by-user/${userId}` // Use userId in API call
        );
        setUserData(response.data);

        // Tour Type Analysis
        const tourTypeCounts = response.data.tours.reduce((acc, tour) => {
          const type = tour.tourType;
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});

        const translateTourType = (type) => {
          const translations = {
            GROUP: "Nhóm",
            FAMILY: "Gia đình",
            DELETE: "Xóa",
          };
          return translations[type] || type;
        };

        const tourTypeArray = Object.entries(tourTypeCounts).map(
          ([type, count]) => ({
            type: translateTourType(type),
            count,
          }),
        );
        setTourTypeData(tourTypeArray);

        // Revenue Analysis
        const revenueByType = [{
          userName: response.data.userName,
          adultRevenue: response.data.ticketRevenue?.ADULTS || 0,
          childRevenue: response.data.ticketRevenue?.CHILDREN || 0,
          elderlyRevenue: response.data.ticketRevenue?.ELDERLY || 0,
        }];
        setRevenueData(revenueByType);

        const revenueByUser = [{
          userName: response.data.userName,
          totalRevenue: response.data.totalPrice || 0,
          totalTours: response.data.tourCount,
        }];
        setRevenueUser(revenueByUser);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu tour", error);
      }
    };

    fetchTourData();
  }, []);

  // Custom color palettes for each chart
  const COLOR_PALETTES = {
    agencyTours: [
      "#3498db",
      "#2980b9",
      "#34495e",
      "#2c3e50",
      "#1abc9c",
      "#16a085",
    ],
    tourTypes: [
      "#0088FE",
      "#00C49F",
      "#FFBB28",
      "#f39c12",
      "#f1c40f",
      "#8e44ad",
      "#9b59b6",
      "#34495e",
    ],
    revenueByAge: ["#2ecc71", "#3498db", "#e74c3c"],
    agencyRevenue: [
      "#e056fd",
      "#9b59b6",
      "#3498db",
      "#2980b9",
      "#e74c3c",
      "#c0392b",
    ],
  };

  return (
 <div>
<NavHeader textColor="black"/>
 <Container>
      <Typography
        variant="h4"
        sx={{
          my: 3,
          textAlign: "center",
          fontWeight: "bold",
          color: "#2c3e50",
        }}
      >
        Thống Kê Chi Tiết Tour
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={6} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#2c3e50", mb: 2 }}>
                Số Lượng Tour Của Từng Đại Lý
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={[userData]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
                  <XAxis dataKey="userName" tick={{ fill: "#34495e" }} />
                  <YAxis tick={{ fill: "#34495e" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ecf0f1",
                      border: "none",
                    }}
                    labelStyle={{ color: "#2c3e50", fontWeight: "bold" }}
                  />
                  <Bar dataKey="tourCount" name="Số Lượng Tour">
                    <Cell fill={COLOR_PALETTES.agencyTours[0]} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={6} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#2c3e50", mb: 2 }}>
                Phân Bổ Loại Tour
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={tourTypeData}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={60}
                    paddingAngle={5}
                  >
                    {tourTypeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          COLOR_PALETTES.tourTypes[
                            index % COLOR_PALETTES.tourTypes.length
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ecf0f1",
                      border: "none",
                    }}
                    labelStyle={{ color: "#2c3e50", fontWeight: "bold" }}
                  />
                  <Legend
                    iconType="circle"
                    align="center"
                    verticalAlign="bottom"
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={6} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#2c3e50", mb: 2 }}>
                Doanh Thu Theo Nhóm Tuổi
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
                  <XAxis dataKey="userName" tick={{ fill: "#34495e" }} />
                  <YAxis tick={{ fill: "#34495e" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ecf0f1",
                      border: "none",
                    }}
                    labelStyle={{ color: "#2c3e50", fontWeight: "bold" }}
                    formatter={(value, name) => {
                      const formattedValue = new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(value);

                      let label = "";
                      switch (name) {
                        case "childRevenue":
                          label = "Doanh Thu Trẻ Em:";
                          break;
                        case "adultRevenue":
                          label = "Doanh Thu Người Lớn:";
                          break;
                        case "elderlyRevenue":
                          label = "Doanh Thu Người Cao Tuổi:";
                          break;
                        default:
                          label = "Doanh Thu:";
                      }
                      return [formattedValue, label];
                    }}
                  />
                  <Bar
                    dataKey="childRevenue"
                    name="Trẻ Em"
                    stackId="a"
                    fill={COLOR_PALETTES.revenueByAge[0]}
                  />
                  <Bar
                    dataKey="adultRevenue"
                    name="Người Lớn"
                    stackId="a"
                    fill={COLOR_PALETTES.revenueByAge[1]}
                  />
                  <Bar
                    dataKey="elderlyRevenue"
                    name="Người Cao Tuổi"
                    stackId="a"
                    fill={COLOR_PALETTES.revenueByAge[2]}
                  />
                  <Legend align="center" verticalAlign="bottom" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={6} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#2c3e50", mb: 2 }}>
                Doanh Thu Từng Đại Lý
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={revenueUser}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
                  <XAxis dataKey="userName" tick={{ fill: "#34495e" }} />
                  <YAxis tick={{ fill: "#34495e" }} />
                  <Tooltip
                    formatter={(value) => [
                      new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(value),
                      "Doanh Thu",
                    ]}
                    contentStyle={{
                      backgroundColor: "#ecf0f1",
                      border: "none",
                    }}
                    labelStyle={{ color: "#2c3e50", fontWeight: "bold" }}
                  />
                  <Bar dataKey="totalRevenue">
                    <Cell fill={COLOR_PALETTES.agencyRevenue[0]} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
 </div>
 

  );
};

export default TourProviderDetail;