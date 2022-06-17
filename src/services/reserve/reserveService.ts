class ReserveService {

  constructor(
    private readonly reserveRepository: any,
    private readonly logger: any
  ) {
  }

  public async getReservation(userId: number) {

    try {

      

    } catch (error) {
      this.logger.appLogger.log({ level: "error", message: error.message });
      throw error;
    }

  }

  public async postReservation() {

    try {

    } catch (error) {
      this.logger.appLogger.log({ level: "error", message: error.message });
      throw error;
    }

  }

  public async getReservationOnCalender() {

    try {

    } catch (error) {
      this.logger.appLogger.log({ level: "error", message: error.message });
      throw error;
    }

  }

  public async removeReservation() {

    try {

    } catch (error) {
      this.logger.appLogger.log({ level: "error", message: error.message });
      throw error;
    }

  }

  public async removeReservationHistory() {

    try {

    } catch (error) {
      this.logger.appLogger.log({ level: "error", message: error.message });
      throw error;
    }

  }

}

export default ReserveService;