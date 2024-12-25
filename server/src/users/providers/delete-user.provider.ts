import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
  } from '@nestjs/common';
  import { User } from '../user.entity';
  import { DataSource } from 'typeorm';
  import { Message } from 'src/messages/message.entity';
  
  @Injectable()
export class DeleteUserProvider {
  private logger = new Logger(DeleteUserProvider.name)
  constructor(
    private dataSource: DataSource,
  ) {}

  async deleteUser(id: number) {
    return await this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const messageRepo = manager.getRepository(Message);

      const user = await userRepo.findOne({
        where: { id },
        relations: ['chat'],
      });

      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다');
      }

      await messageRepo
        .createQueryBuilder()
        .delete()
        .where('sender.id = :userId', { userId: id })
        .execute();

      const result = await userRepo.delete(id);

      if (result.affected === 0) {
        throw new BadRequestException('사용자 삭제에 실패했습니다');
      }

      this.logger.log(`User deleted successfully. User ID: ${id}`);

      return result;
    });
  }
}