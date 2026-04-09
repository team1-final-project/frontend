import React from "react";
import styled from "styled-components";
import {
  Bell,
  Search,
  MoreVertical,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import SummaryCard from "../../components/SummaryCard";

const revenueTrend = [
  { day: "MON", sales: 8, cost: 5 },
  { day: "TUE", sales: 12, cost: 8 },
  { day: "WED", sales: 10, cost: 7 },
  { day: "THU", sales: 13, cost: 9 },
  { day: "FRI", sales: 18, cost: 12 },
  { day: "SAT", sales: 22, cost: 15 },
  { day: "SUN", sales: 21, cost: 14 },
];

const waveData = [
  { day: "MON", value: 18 },
  { day: "TUE", value: 10 },
  { day: "WED", value: 8 },
  { day: "THU", value: 11 },
  { day: "FRI", value: 13 },
  { day: "SAT", value: 12 },
  { day: "SUN", value: 5 },
];

const categoryTrend = [
  { day: "Mon", value: 12 },
  { day: "Tue", value: 24 },
  { day: "Wed", value: 24 },
  { day: "Thu", value: 38 },
  { day: "Fri", value: 29 },
  { day: "Sat", value: 41 },
  { day: "Sun", value: 32 },
];

const priceChangeData = [
  { name: "1", value: 8 },
  { name: "2", value: 11 },
  { name: "3", value: 7 },
  { name: "4", value: 10 },
  { name: "5", value: 12 },
  { name: "6", value: 6 },
  { name: "7", value: 14 },
  { name: "8", value: 10 },
  { name: "9", value: 9 },
  { name: "10", value: 13 },
  { name: "11", value: 16 },
  { name: "12", value: 8 },
  { name: "13", value: 7 },
  { name: "14", value: 12 },
  { name: "15", value: 10 },
  { name: "16", value: 9 },
  { name: "17", value: 14 },
  { name: "18", value: 11 },
  { name: "19", value: 6 },
  { name: "20", value: 9 },
  { name: "21", value: 15 },
  { name: "22", value: 8 },
  { name: "23", value: 7 },
  { name: "24", value: 10 },
  { name: "25", value: 13 },
  { name: "26", value: 6 },
  { name: "27", value: 12 },
  { name: "28", value: 9 },
];

const countrySales = [
  { country: "United States", short: "USA", value: 30, change: "+25.8%" },
  { country: "Brazil", short: "Brazil", value: 26, change: "-16.2%" },
  { country: "India", short: "India", value: 22, change: "+12.3%" },
  { country: "Australia", short: "Australia", value: 17, change: "-11.9%" },
];

const tableRows = [
  { id: "#5089", date: "31 March 2023", total: "$1200" },
  { id: "#5089", date: "31 March 2023", total: "$1200" },
  { id: "#5089", date: "31 March 2023", total: "$1200" },
  { id: "#5089", date: "31 March 2023", total: "$1200" },
  { id: "#5089", date: "31 March 2023", total: "$1200" },
  { id: "#5089", date: "31 March 2023", total: "$1200" },
];

const topProducts = [
  { name: "Apple iPhone 13", item: "Item # FXZ-4567", price: "$999.29" },
  { name: "Nike Air Jordan", item: "Item # FXZ-3456", price: "$72.40" },
  { name: "Beats Studio 2", item: "Item # FXZ-9485", price: "$99.90" },
  { name: "Apple Watch Series 7", item: "Item # FXZ-2345", price: "$249.99" },
  { name: "Amazon Echo Dot", item: "Item # FXZ-8859", price: "$79.40" },
  { name: "PlayStation Console", item: "Item # FXZ-7892", price: "$128.48" },
];

export default function Dashboard() {
  return (
    <PageWrap>
      <TopBar>
        <TitleArea>
          <PageTitle>Dashboard</PageTitle>
          <DateText>2026.04.06 ｜ 11 : 36 am</DateText>
        </TitleArea>

        <TopActions>
          <IconButton type="button">
            <Search size={18} />
          </IconButton>

          <Divider />

          <NotifyWrap>
            <Bell size={18} />
            <NotifyDot />
          </NotifyWrap>

          <ProfileCircle />
        </TopActions>
      </TopBar>

      <DashboardGrid>
        <MainColumn>
          <TopMetricsGrid>
            <MetricCardLarge>
              <MetricCardHeader>
                <div>
                  <MetricLabel>주별 수익</MetricLabel>
                  <MetricSub>Last 7 days</MetricSub>
                </div>

                <LegendWrap>
                  <LegendItem>
                    <LegendDot $color="#2563eb" />
                    Sales
                  </LegendItem>
                  <LegendItem>
                    <LegendDot $color="#93c5fd" />
                    Cost
                  </LegendItem>
                </LegendWrap>
              </MetricCardHeader>

              <MetricMainRow>
                <MetricValue>
                  $350K <MetricBlue>$235K</MetricBlue>
                </MetricValue>
                <MetricChange $up>+ 8.5K</MetricChange>
                <MetricChangeText>vs last 7 days</MetricChangeText>
              </MetricMainRow>

              <ChartBoxLarge>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueTrend}>
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10, fill: "#9ca3af" }}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="cost"
                      stroke="#60a5fa"
                      strokeWidth={2.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartBoxLarge>
            </MetricCardLarge>

            <MetricCardLarge>
              <MetricCardHeader>
                <div>
                  <MetricLabel>월별 수익</MetricLabel>
                  <MetricSub>Last 7 days</MetricSub>
                </div>
              </MetricCardHeader>

              <MetricMainRow>
                <MetricValue>16.5K</MetricValue>
                <MetricChange $up={false}>- 3%</MetricChange>
                <MetricChangeText>vs last 7 days</MetricChangeText>
              </MetricMainRow>

              <ChartBoxLarge>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={waveData}>
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartBoxLarge>
            </MetricCardLarge>
          </TopMetricsGrid>

          <MiniMetricsGrid>
            <SummaryCard
              title="현재 판매 상품 수"
              subText="Last 7 days"
              value="25.7K"
              change="7.8%"
              up
            />

            <SummaryCard
              title="가격 변동 건수"
              subText="Last 7 days"
              value="12K"
              change="2%"
              up={false}
            />

            <SummaryCard
              title="최고 부족 상품"
              subText="Last 7 days"
              value="25.7K"
              change="6%"
              up
            />

            <SummaryCard
              title="예상 매출"
              subText="Last 7 days"
              value="12K"
              change="2%"
              up={false}
            />
          </MiniMetricsGrid>

          <BottomGrid>
            <LeftBottomColumn>
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>카테고리 별 판매 추이</CardTitle>
                    <CardSub>Last 7 Days</CardSub>
                  </div>
                  <MoreVertical size={18} color="#9ca3af" />
                </CardHeader>

                <CategoryStats>
                  <CategoryStat>
                    <strong>24k</strong>
                    <span>Customers</span>
                  </CategoryStat>
                  <CategoryStat>
                    <strong>3.5k</strong>
                    <span>Total Products</span>
                  </CategoryStat>
                  <CategoryStat>
                    <strong>2.5k</strong>
                    <span>Stock Products</span>
                  </CategoryStat>
                  <CategoryStat>
                    <strong>0.5k</strong>
                    <span>Out of Stock</span>
                  </CategoryStat>
                  <CategoryStat>
                    <strong>250k</strong>
                    <span>Revenue</span>
                  </CategoryStat>
                </CategoryStats>

                <LargeChartBox>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={categoryTrend}>
                      <CartesianGrid vertical={false} stroke="#eef0f4" />
                      <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                      />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#2563eb"
                        fill="#dbeafe"
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </LargeChartBox>
              </Card>

              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>최근 가격 변동 상품</CardTitle>
                  </div>
                  <ViewAll>View All</ViewAll>
                </CardHeader>

                <TableWrap>
                  <StyledTable>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>ISSUED DATE</th>
                        <th>TOTAL</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map((row, index) => (
                        <tr key={`${row.id}-${index}`}>
                          <td className="id">{row.id}</td>
                          <td>{row.date}</td>
                          <td>{row.total}</td>
                          <td className="action">View Detail</td>
                        </tr>
                      ))}
                    </tbody>
                  </StyledTable>
                </TableWrap>
              </Card>
            </LeftBottomColumn>

            <RightBottomColumn>
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>카테고리 별 가격 변동</CardTitle>
                    <CardBigValue>16.5K</CardBigValue>
                    <CardSub>Users per minute</CardSub>
                  </div>
                </CardHeader>

                <BarChartBox>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={priceChangeData}>
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#2563eb"
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </BarChartBox>

                <SalesCountryHeader>
                  <span>Sales by Country</span>
                  <span>Sales</span>
                </SalesCountryHeader>

                <CountryList>
                  {countrySales.map((item) => (
                    <CountryRow key={item.country}>
                      <CountryInfo>
                        <FlagCircle />
                        <CountryTextWrap>
                          <strong>{item.value}k</strong>
                          <span>{item.short}</span>
                        </CountryTextWrap>
                      </CountryInfo>

                      <CountryBarWrap>
                        <CountryBar>
                          <CountryBarFill
                            style={{ width: `${item.value * 2.5}%` }}
                          />
                        </CountryBar>
                      </CountryBarWrap>

                      <CountryChange $up={!item.change.startsWith("-")}>
                        {item.change}
                      </CountryChange>
                    </CountryRow>
                  ))}
                </CountryList>
              </Card>

              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>상위 판매 상품</CardTitle>
                    <CardSub>Total 10.4K Visitors</CardSub>
                  </div>
                  <MoreVertical size={18} color="#9ca3af" />
                </CardHeader>

                <TopProductList>
                  {topProducts.map((item) => (
                    <TopProductItem key={item.name}>
                      <TopProductThumb />
                      <TopProductText>
                        <strong>{item.name}</strong>
                        <span>{item.item}</span>
                      </TopProductText>
                      <TopProductPrice>{item.price}</TopProductPrice>
                    </TopProductItem>
                  ))}
                </TopProductList>
              </Card>
            </RightBottomColumn>
          </BottomGrid>
        </MainColumn>
      </DashboardGrid>
    </PageWrap>
  );
}

const PageWrap = styled.div`
  padding: 26px 24px 24px;
  background: #f5f6f8;
`;

const TopBar = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const TitleArea = styled.div``;

const PageTitle = styled.h1`
  margin: 0 0 8px;
  color: #111827;
  font-size: 22px;
  font-weight: 700;
`;

const DateText = styled.div`
  color: #4b5563;
  font-size: 14px;
  font-weight: 500;
`;

const TopActions = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const IconButton = styled.button`
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Divider = styled.div`
  width: 1px;
  height: 18px;
  background: #d1d5db;
`;

const NotifyWrap = styled.div`
  position: relative;
  color: #6b7280;
  display: flex;
`;

const NotifyDot = styled.div`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #ef4444;
`;

const ProfileCircle = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #8b5cf6;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
`;

const MainColumn = styled.div`
  min-width: 0;
`;

const TopMetricsGrid = styled.div`
  display: grid;
  grid-template-columns: 1.55fr 1fr;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const MiniMetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: 1.6fr 0.9fr;
  gap: 16px;

  @media (max-width: 1300px) {
    grid-template-columns: 1fr;
  }
`;

const LeftBottomColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RightBottomColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.03);
`;

const MetricCardLarge = styled(Card)`
  min-height: 210px;
`;

const MetricCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const MetricLabel = styled.div`
  color: #111827;
  font-size: 14px;
  font-weight: 700;
`;

const MetricSub = styled.div`
  margin-top: 4px;
  color: #9ca3af;
  font-size: 12px;
`;

const LegendWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #94a3b8;
  font-size: 11px;
`;

const LegendDot = styled.div`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const MetricMainRow = styled.div`
  margin-top: 16px;
`;

const MetricValue = styled.div`
  color: #111827;
  font-size: 38px;
  font-weight: 800;
  line-height: 1.1;
`;

const MetricBlue = styled.span`
  color: #3b82f6;
  font-size: 20px;
  margin-left: 8px;
`;

const MetricChange = styled.div`
  margin-top: 10px;
  color: ${({ $up }) => ($up ? "#22c55e" : "#ef4444")};
  font-size: 13px;
  font-weight: 700;
`;

const MetricChangeText = styled.div`
  color: #9ca3af;
  font-size: 12px;
  margin-top: 2px;
`;

const ChartBoxLarge = styled.div`
  width: 100%;
  height: 90px;
  margin-top: 12px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const CardTitle = styled.div`
  color: #111827;
  font-size: 15px;
  font-weight: 700;
`;

const CardSub = styled.div`
  margin-top: 4px;
  color: #9ca3af;
  font-size: 12px;
`;

const CardBigValue = styled.div`
  margin-top: 8px;
  color: #111827;
  font-size: 34px;
  font-weight: 800;
`;

const CategoryStats = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-top: 18px;
  margin-bottom: 10px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CategoryStat = styled.div`
  strong {
    display: block;
    color: #111827;
    font-size: 28px;
    font-weight: 800;
    line-height: 1;
  }

  span {
    display: block;
    margin-top: 6px;
    color: #9ca3af;
    font-size: 11px;
  }
`;

const LargeChartBox = styled.div`
  width: 100%;
  height: 260px;
  margin-top: 10px;
`;

const ViewAll = styled.button`
  border: none;
  background: transparent;
  color: #2563eb;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`;

const TableWrap = styled.div`
  margin-top: 14px;
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead th {
    text-align: left;
    color: #9ca3af;
    font-size: 11px;
    font-weight: 700;
    padding: 14px 12px;
    background: #f8fafc;
  }

  tbody td {
    padding: 14px 12px;
    border-top: 1px solid #eef2f7;
    color: #4b5563;
    font-size: 13px;
  }

  tbody td.id {
    color: #2563eb;
    font-weight: 600;
  }

  tbody td.action {
    color: #2563eb;
    font-weight: 600;
    cursor: pointer;
  }
`;

const BarChartBox = styled.div`
  width: 100%;
  height: 80px;
  margin-top: 14px;
`;

const SalesCountryHeader = styled.div`
  margin-top: 14px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #111827;
  font-size: 13px;
  font-weight: 700;
`;

const CountryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CountryRow = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr 70px;
  gap: 12px;
  align-items: center;
`;

const CountryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FlagCircle = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e5e7eb, #cbd5e1);
`;

const CountryTextWrap = styled.div`
  strong {
    display: block;
    color: #111827;
    font-size: 14px;
    font-weight: 700;
  }

  span {
    display: block;
    margin-top: 2px;
    color: #9ca3af;
    font-size: 11px;
  }
`;

const CountryBarWrap = styled.div``;

const CountryBar = styled.div`
  width: 100%;
  height: 4px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
`;

const CountryBarFill = styled.div`
  height: 100%;
  border-radius: 999px;
  background: #2563eb;
`;

const CountryChange = styled.div`
  text-align: right;
  color: ${({ $up }) => ($up ? "#22c55e" : "#ef4444")};
  font-size: 12px;
  font-weight: 700;
`;

const TopProductList = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const TopProductItem = styled.div`
  display: grid;
  grid-template-columns: 44px 1fr auto;
  gap: 12px;
  align-items: center;
`;

const TopProductThumb = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #e5e7eb, #f8fafc);
`;

const TopProductText = styled.div`
  strong {
    display: block;
    color: #111827;
    font-size: 13px;
    font-weight: 700;
  }

  span {
    display: block;
    margin-top: 4px;
    color: #9ca3af;
    font-size: 11px;
  }
`;

const TopProductPrice = styled.div`
  color: #111827;
  font-size: 13px;
  font-weight: 700;
`;
