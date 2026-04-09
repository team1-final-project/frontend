import React, { useMemo, useState } from "react";
import styled from "styled-components";
import TableComponent, {
  RowActionButton,
} from "../../components/TableComponent";
import StatusBadge from "../../components/StatusBadge";

const initialData = [
  {
    id: "#6548",
    created: "2 min ago",
    customer: "Joseph Wheeler",
    total: "$654",
    profit: "$154",
    status: "Pending",
  },
  {
    id: "#6549",
    created: "5 min ago",
    customer: "Emily Carter",
    total: "$420",
    profit: "$110",
    status: "Completed",
  },
  {
    id: "#6550",
    created: "12 min ago",
    customer: "Daniel Lee",
    total: "$890",
    profit: "$210",
    status: "Cancelled",
  },
  {
    id: "#6551",
    created: "20 min ago",
    customer: "Sophia Kim",
    total: "$350",
    profit: "$90",
    status: "Pending",
  },
  {
    id: "#6552",
    created: "30 min ago",
    customer: "Noah Smith",
    total: "$740",
    profit: "$180",
    status: "Completed",
  },
];

const statusOptions = [
  { label: "Pending", value: "Pending" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
  { label: "Review", value: "Review" },
  { label: "Active", value: "Active" },
];

export default function OrderListTest() {
  const [tableData, setTableData] = useState(initialData);
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleStatusChange = (id, nextStatus) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: nextStatus } : item,
      ),
    );
  };

  const filteredData = useMemo(() => {
    return tableData.filter((item) => {
      const keyword = searchValue.toLowerCase();

      const matchesSearch =
        item.id.toLowerCase().includes(keyword) ||
        item.customer.toLowerCase().includes(keyword);

      const matchesFilter = filterValue ? item.status === filterValue : true;

      return matchesSearch && matchesFilter;
    });
  }, [tableData, searchValue, filterValue]);

  const columns = [
    {
      key: "id",
      title: "ORDER ID",
      width: "120px",
      render: (value) => <StrongText>{value}</StrongText>,
    },
    {
      key: "created",
      title: "CREATED",
      width: "120px",
      sortable: false,
    },
    {
      key: "customer",
      title: "CUSTOMER",
      width: "180px",
    },
    {
      key: "total",
      title: "TOTAL",
      width: "100px",
      sortType: "number",
    },
    {
      key: "profit",
      title: "PROFIT",
      width: "100px",
      sortType: "number",
    },
    {
      key: "statusView",
      title: "STATUS",
      width: "130px",
      sortable: false,
      render: (_, row) => <StatusBadge value={row.status} width="110px" />,
    },
    {
      key: "statusEdit",
      title: "CHANGE STATUS",
      width: "160px",
      sortable: false,
      render: (_, row) => (
        <StatusBadge
          value={row.status}
          mode="select"
          options={statusOptions}
          onChange={(nextStatus) => handleStatusChange(row.id, nextStatus)}
          width="120px"
        />
      ),
    },
    {
      key: "action",
      title: "",
      width: "60px",
      align: "center",
      sortable: false,
      render: (_, row) => (
        <RowActionButton onClick={() => console.log("row action:", row)} />
      ),
    },
  ];

  return (
    <PageWrap>
      <TopRow>
        <Title>Order List Test</Title>
      </TopRow>

      <TableComponent
        columns={columns}
        data={filteredData}
        rowKey="id"
        searchValue={searchValue}
        onSearchChange={(value) => {
          setSearchValue(value);
          setPage(1);
        }}
        searchPlaceholder="Search by order id or customer"
        filterValue={filterValue}
        onFilterChange={(value) => {
          setFilterValue(value);
          setPage(1);
        }}
        filterPlaceholder="Filter by status"
        filterOptions={statusOptions}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </PageWrap>
  );
}

const PageWrap = styled.div`
  padding: 24px;
`;

const TopRow = styled.div`
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h2`
  margin: 0;
  color: #111827;
  font-size: 20px;
  font-weight: 700;
`;

const StrongText = styled.strong`
  color: #111827;
  font-weight: 700;
`;
