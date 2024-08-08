import { Test } from "@nestjs/testing";
import { TasksService } from "./tasks.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Task } from "./entities/task.entity";

describe('Task Service', () => {

    let tasksService: TasksService

    let fakeTaskRepository: any

    enum TaskStatus {
        OPEN = 'OPEN',
        IN_PROGRESS = 'IN_PROGRESS',
        DONE = 'DONE'
    }

    const mockUser = { id: '1', username: 'buvghhj', password: 'password', tasks: [] }

    const mockFilter = { status: TaskStatus.OPEN, search: 'something' }

    beforeEach(async () => {

        fakeTaskRepository = {

            createQueryBuilder: jest.fn().mockReturnValue({

                where: jest.fn().mockReturnThis(),

                andWhere: jest.fn().mockReturnThis(),

                getMany: jest.fn().mockResolvedValue(['task1', 'task2'])

            })

        }

        const module = await Test.createTestingModule({

            providers: [

                TasksService,

                {

                    provide: getRepositoryToken(Task),

                    useValue: fakeTaskRepository

                }

            ]

        }).compile()

        tasksService = module.get<TasksService>(TasksService)

    })

    it('can create an instance of tasks service', async () => {

        expect(tasksService).toBeDefined()

    })

    it('return all tasks', async () => {

        const tasks = await tasksService.getTasks(mockFilter, mockUser)

        expect(tasks).toEqual(['task1', 'task2'])

        expect(fakeTaskRepository.createQueryBuilder).toHaveBeenCalled()

        expect(fakeTaskRepository.createQueryBuilder().where).toHaveBeenCalledWith({ user: mockUser })

        if (mockFilter.status) {

            expect(fakeTaskRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith('task.status = :status', { status: mockFilter.status })

        }

        if (mockFilter.search) {

            expect(fakeTaskRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith('(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', { search: `%${mockFilter.search}%` })

        }

        expect(fakeTaskRepository.createQueryBuilder().getMany).toHaveBeenCalled()
    })

})

