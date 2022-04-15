"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ResultMessage = {
    NULL_VALUE: "필요한 값이 없습니다",
    WRONG_PARAMS: "파라미터 값이 잘못되었습니다",
    WRONG_PARAMS_OR_NULL: "파라미터 값이 없거나 잘못되었습니다",
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
    // 로그아웃
    LOGOUT_SUCCESS: "로그아웃 성공",
    // 프로필 조회
    READ_PROFILE_SUCCESS: "프로필 조회 성공",
    // 유저
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
}; // as const;
exports.default = ResultMessage;
//# sourceMappingURL=resultMessage.js.map