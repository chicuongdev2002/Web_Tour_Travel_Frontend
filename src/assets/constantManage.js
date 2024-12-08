const constant = {
  HI: "Xin chào! Tôi là trợ lý ảo của công ty Xuyên Việt Tour. Tôi có thể giúp gì cho bạn hôm nay? 😊",
  SEARCH_TOUR: "Tìm tour",
  SEARCH_TOUR_2: "Tìm tour du lịch",
  VIEW_TOUR: "Xem danh sách tour",
  SELECT_TOUR_TYPE: "Chọn loại tour",
  SEARCH_FAMILY_TOUR: "Tour gia đình",
  SEARCH_GROUP_TOUR: "Tour nhóm",
  SEARCH_NORTHERN_TOUR: "Tour miền Bắc",
  SEARCH_CENTRAL_TOUR: "Tour miền Trung",
  SEARCH_SOUTHERN_TOUR: "Tour miền Nam",
  CANCLE_TOUR_POLICY: "Chính sách huỷ tour",
  PAYMENTS_METHOD: "Các phương thức thanh toán",
};

const valueRep = [
  {}, // HI
  {
    // SEARCH_TOUR
    keyword: "where",
    data: [
      {
        me: false,
        content:
          "Bạn muốn tham gia tour ở đâu?(Để giảm thời gian phản hồi, nếu bạn muốn khởi hành ở 1 thành phố cụ thể hãy thêm tên tỉnh/thành phố ở trước, ví dụ: Bình Định, Quy Nhơn)",
        createDate: new Date(),
      },
    ],
  },
  {
    // SEARCH_TOUR_2
    keyword: "where",
    data: [
      {
        me: false,
        content:
          "Bạn muốn tham gia tour ở đâu?(Để giảm thời gian chờ phản hồi, nếu bạn muốn khởi hành ở 1 thành phố cụ thể hãy thêm tên tỉnh/thành phố ở trước, ví dụ: Bình Định, Quy Nhơn)",
        createDate: new Date(),
      },
    ],
  },
  {
    // VIEW_TOUR
    keyword: "viewTour",
    data: [
      {
        me: false,
        content: "Xin đợi một lát, tôi sẽ tìm tour phù hợp cho bạn",
        createDate: new Date(),
      },
    ],
  },
  {
    // SELECT_TOUR_TYPE
    keyword: "selectTourType",
    data: [
      {
        me: false,
        content:
          "Bạn muốn tham gia tour loại nào? Tôi sẽ gợi ý cho bạn một số loại tour phổ biến:",
        createDate: new Date(),
      },
      {
        me: false,
        content: constant.SEARCH_FAMILY_TOUR,
        onClick: constant.SEARCH_FAMILY_TOUR,
      },
      {
        me: false,
        content: constant.SEARCH_GROUP_TOUR,
        onClick: constant.SEARCH_GROUP_TOUR,
      },
    ],
  },
  [
    // SEARCH_FAMILY_TOUR
    {
      me: false,
      content: "Bạn muốn tham gia tour gia đình",
      createDate: new Date(),
    },
    {
      me: false,
      content: "Xin đợi một lát, tôi sẽ tìm tour phù hợp cho bạn",
      createDate: new Date(),
    },
  ],
  [
    // SEARCH_GROUP_TOUR
    {
      me: false,
      content: "Bạn muốn tham gia tour nhóm",
      createDate: new Date(),
    },
    {
      me: false,
      content: "Xin đợi một lát, tôi sẽ tìm tour phù hợp cho bạn",
      createDate: new Date(),
    },
  ],
  [
    // SEARCH_NORTHERN_TOUR
    {
      me: false,
      content: "Bạn muốn tham gia tour miền Bắc",
      createDate: new Date(),
    },
    {
      me: false,
      content: "Xin đợi một lát, tôi sẽ tìm tour phù hợp cho bạn",
      createDate: new Date(),
    },
  ],
  [
    // SEARCH_CENTRAL_TOUR
    {
      me: false,
      content: "Bạn muốn tham gia tour miền Trung",
      createDate: new Date(),
    },
    {
      me: false,
      content: "Xin đợi một lát, tôi sẽ tìm tour phù hợp cho bạn",
      createDate: new Date(),
    },
  ],
  [
    // SEARCH_SOUTHERN_TOUR
    {
      me: false,
      content: "Bạn muốn tham gia tour miền Nam",
      createDate: new Date(),
    },
    {
      me: false,
      content: "Xin đợi một lát, tôi sẽ tìm tour phù hợp cho bạn",
      createDate: new Date(),
    },
  ],
];

export { valueRep };
export default constant;
