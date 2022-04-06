// 값 자체보다 값이 구별되어야 할 때와 같이 코드의 의도를 알려주는데에 enum을 사용하자
const enum Error {
    NULL_VALUE = 1, // 필요한 값이 없을 때
    WRONG_EMAIL_CONVENTION, // 이메일 형식이 잘못 되었을 때
    WRONG_NICKNAME_CONVENTION, // 닉네임 형식이 잘못 되었을 때
    WRONG_PASSWORD_CONVENTION, // 비밀번호 형식이 잘못 되었을 때
    USER_ALREADY_EXIST, // 이미 존재하는 사용자 일 때
    NICKNAME_ALREADY_EXIST, // 이미 존재하는 닉네임 일 때
    WRONG_IMG_FORM, // 잘못된 이미지 폼일 때
    WRONG_REQUEST_VALUE, // 잘못된 요청값이 들어왔을 때
    VALUE_ALREADY_EXIST, // 이미 존재하는 값일 때
    VALUE_ALREADY_DELETED, // 이미 삭제된 값일 때
    DB_NOT_FOUND, // DB 응답값이 없을 때
    NON_EXISTENT_USER, // 존재하지 않는 유저일 때
    EMAIL_NOT_FOUND, // 이메일이 존재하지 않을 때
    PW_NOT_CORRECT, // 비밀번호가 일치하지 않을 때
    ANONYMOUS_USER, // 비회원인 유저일 때
    FAIL_SIGNUP, // 회원가입 실패
    TOKEN_EXPIRES, // 토큰 만료
}

export default Error;