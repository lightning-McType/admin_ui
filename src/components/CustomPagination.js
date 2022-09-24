import { Pagination } from "react-bootstrap";

function CustomPagination(props) {
  const pageCount = [];
  for (let i = 1; i <= props.totalPages; i++) {
    pageCount.push(i);
  }
  return (
    <Pagination className="float-md-end d-flex justify-content-center pt-2">
      <Pagination.First onClick={() => props.paginate(1)} />
      <Pagination.Prev
        disabled={props.totalPages === 1 || props.currentPage === 1}
        onClick={() => props.paginate(props.currentPage - 1)}
      />

      {pageCount.map((number) => (
        <Pagination.Item
          className={number === props.currentPage ? "active" : ""}
          onClick={() => props.paginate(number)}
          key={number}
        >
          {number}
        </Pagination.Item>
      ))}
      <Pagination.Next
        disabled={props.totalPages === 1 || props.currentPage === pageCount.length}
        onClick={() => props.paginate(props.currentPage + 1)}
      />
      <Pagination.Last onClick={() => props.paginate(props.totalPages)} />
    </Pagination>
  );
};

export default CustomPagination;
