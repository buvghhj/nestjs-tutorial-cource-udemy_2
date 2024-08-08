import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTaskDto, TaskStatus } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class TasksService {

    private logger = new Logger('Task Service')

    constructor(@InjectRepository(Task) private readonly taskRepo: Repository<Task>) { }

    public async createTasks(createTaskDto: CreateTaskDto, user: User): Promise<Task> {

        const { title, description } = createTaskDto

        const task = this.taskRepo.create({ title, description, status: TaskStatus.OPEN })

        task.user = user

        await this.taskRepo.save(task)

        return task

    }

    public async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {

        const { status, search } = filterDto

        const query = this.taskRepo.createQueryBuilder('task')

        query.where({ user })

        if (status) {

            query.andWhere('task.status = :status', { status })

        }

        if (search) {

            query.andWhere(
                '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', { search: `%${search}%` }
            )

        }

        try {

            const tasks = await query.getMany()

            return tasks

        } catch (error) {

            this.logger.error(`Failed to get tasks for user "${user.username}". Filte: ${JSON.stringify(filterDto)}`, error.stack)

            throw new InternalServerErrorException()

        }

    }

    public async getTaskById(id: string, user: User): Promise<Task> {

        const task = await this.taskRepo.findOne({ where: { id, user } })

        if (!task) {

            throw new NotFoundException(`Task not found with ID ${id}`)

        }

        return task

    }

    public async updateTaskStatus(updateTaskStatusDto: UpdateTaskStatusDto, id: string, user: User): Promise<Task> {

        const task = await this.getTaskById(id, user)

        if (!task) {

            throw new NotFoundException(`Task not found with ID ${id}`)

        }

        task.status = updateTaskStatusDto.status

        await this.taskRepo.save(task)

        return task

    }

    public async deleteTask(id: string, user: User) {

        await this.taskRepo.delete({ id, user })

        return { message: 'Task deleted successfully' }

    }


}
