const ResultMessage = {
  NULL_VALUE: "필요한 값이 없습니다",
  WRONG_PARAMS: "파라미터 값이 잘못되었습니다",
  WRONG_PARAMS_OR_NULL: "파라미터 값이 없거나 잘못되었습니다",
  WRONG_BODY_OR_NULL: "바디 값이 없거나 잘못되었습니다",
  DB_ERROR: "디비 에러",
  
  // 회원가입
  CREATED_USER: "회원 가입 성공",
  DELETE_USER: "회원 탈퇴 성공",
  USER_ALREADY_EXIST: "이미 사용중인 이메일입니다.",
  WRONG_PASSWORD_CONVENTION: "비밀번호 형식이 잘못되었습니다.",
  FAIL_SIGNUP: "회원가입에 실패했습니다.",
  
  // 로그인
  LOGIN_SUCCESS: "로그인 성공",
  LOGIN_FAIL: "로그인 실패",
  NO_USER: "존재하지 않는 회원입니다.",
  MISS_MATCH_PW: "비밀번호가 맞지 않습니다.",
  WRONG_EMAIL_CONVENTION: "이메일 형식이 잘못되었습니다.",
  PLEASE_LOGIN_AGAIN: "다시 로그인 하십시오.",
  AXIOS_VALIDATE_ERROR: "카카오 토큰이 만료되었습니다.",
  
  // 로그아웃
  LOGOUT_SUCCESS: "로그아웃 성공",
  
  // 프로필 조회
  READ_PROFILE_SUCCESS: "프로필 조회 성공",
  
  // 유저
  SET_USER_INFO_SUCCESS: "유저 정보 등록 성공",
  READ_USER_INFO_SUCCESS: "유저 정보 조회 성공",
  UPDATE_USER_INFO_SUCCESS: "유저 정보 수정 성공",
  READ_ONE_USER_SUCCESS: "유저 조회 성공",
  READ_ALL_USERS_SUCCESS: "모든 유저 조회 성공",
  UPDATE_ONE_USER_SUCCESS: "유저 수정 성공",
  DELETE_ONE_USER_SUCCESS: "유저 삭제 성공",
  
  // 포스트
  ADD_ONE_POST_SUCCESS: "포스트 추가 성공",
  READ_ONE_POST_SUCCESS: "포스트 조회 성공",
  READ_ALL_POSTS_SUCCESS: "모든 포스트 조회 성공",
  UPDATE_ONE_POST_SUCCESS: "포스트 수정 성공",
  DELETE_ONE_POST_SUCCESS: "포스트 삭제 성공",
  SEARCH_POST_SUCCESS: "포스트 검색 성공",
  NO_SEARCH_POST: "포스트 검색 결과 없음",
  NO_POST: "존재하지 않는 포스트입니다.",

  // 댓글
  ADD_COMMENT_SUCCESS: "댓글 등록 성공",
  ADD_REPLY_COMMENT_SUCCESS: "대댓글 등록 성공",
  
  // 서버 내 오류
  INTERNAL_SERVER_ERROR: "서버 내 오류",
  
  // 토큰
  REISSUE_TOKEN: "토큰이 재발급 되었습니다.",
  TOKEN_EXPIRED: "토큰이 만료되었습니다.",
  TOKEN_INVALID: "토큰이 유효하지 않습니다.",
  TOKEN_EXPIRED_OR_INVALID: "토믄이 만료되었가나 유효하지 않습니다",
  TOKEN_EMPTY: "토큰이 없습니다.",

  // 왈소리 맹글기
  READ_RESERVED_DATE_SUCCESS: "예약날짜 조회 성공",
  NO_RESERVATION_DATE: "예약날짜 없음",
  ADD_RESERVATION_SUCCESS: "왈소리 맹글기 성공",
  ALREADY_RESERVED_DATE: "이미 예약된 날짜",
  READ_RESERVATIONS_SUCCESS: "왈소리 히스토리 조회 성공",
  NO_RESERVATION: "왈소리 히스토리가 없음",
  DELETE_RESERVATION_SUCCESS: "왈소리 예약 취소 성공",
  DELETE_COMPLETED_RESERVATION_SUCCESS: "왈소리 히스토리 삭제 성공",
  NO_OR_UNCOMPLETED_RESERVATION: "해당하는 왈소리가 없거나 전송되지 않았음",
  NO_OR_COMPLETED_RESERVATION: "해당하는 왈소리가 없거나 이미 전송됐음",

  // 메인
  READ_TODAY_WAL_SUCCESS: "오늘의 왈 조회 성공",
  SHOW_TODAY_WAL_SUCCESS: "오늘의 왈 읽음 처리 성공",
} // as const;

export default ResultMessage;