import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { User } from '../user.entity';
  import { DataSource, Repository } from 'typeorm';
  import { Message } from 'src/messages/message.entity';
  
  @Injectable()
export class DeleteUserProvider {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async deleteUser(id: number) {
    return await this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const messageRepo = manager.getRepository(Message);

      // 사용자 조회
      const user = await userRepo.findOne({
        where: { id },
        relations: ['chat'],
      });

      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다');
      }

      // 해당 사용자가 보낸 메시지 삭제
      await messageRepo
        .createQueryBuilder()
        .delete()
        .where('sender.id = :userId', { userId: id })
        .execute();

      // 사용자 삭제
      const result = await userRepo.delete(id);

      if (result.affected === 0) {
        throw new BadRequestException('사용자 삭제에 실패했습니다');
      }

      return result;
    });
  }
}