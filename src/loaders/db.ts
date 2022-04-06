import sequelize from "../models";

// 시퀄라이즈 연결
export const connectDB = () => {
    sequelize.authenticate()
        .then(async () => {
            console.log("✅ Connect PostgreSQL");
        })
        .catch((err) => {
            console.log("TT : ", err);
        });
    
    // 시퀄라이즈 모델 DB에 싱크
    sequelize.sync({ alter: true })
        .then(() => {
            console.log('✅ Sync Models to DB');
        })
        .catch((err) => {
            console.log('❌ DB ERROR:', err);
        });
}
