import { OrderStatusEnum } from '../enums';

export class OrderStatusUtils {
  private static readonly orderStatusOrder = [
    OrderStatusEnum.WAIT,
    OrderStatusEnum.PACKAGING,
    OrderStatusEnum.ON_THE_ROAD,
    OrderStatusEnum.RECEIVED,
    OrderStatusEnum.DONE,
  ];

  // Hàm kiểm tra trạng thái hợp lệ
  static isNextStatusValid(
    currentStatus: OrderStatusEnum,
    nextStatus: OrderStatusEnum
  ): boolean {
    const currentIndex = this.orderStatusOrder.indexOf(currentStatus);
    const nextIndex = this.orderStatusOrder.indexOf(nextStatus);
    return nextIndex === currentIndex + 1;
  }
}
