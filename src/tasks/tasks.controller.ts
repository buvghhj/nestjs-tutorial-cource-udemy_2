import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {

    private logger = new Logger('Tasks Controller')

    constructor(private readonly tasksService: TasksService) { }

    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto, @GetUser() user: User) {

        this.logger.verbose(`User "${user.username}" retrieving all tasks. Filter: ${JSON.stringify(filterDto)}`)

        return this.tasksService.getTasks(filterDto, user)


    }

    @Post()
    createTasks(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {

        this.logger.verbose(`User ${user.username} creating a new task. Data: ${JSON.stringify(createTaskDto)}`)

        return this.tasksService.createTasks(createTaskDto, user)

    }

    @Get(':id')
    getTaskById(@Param('id') id: string, @GetUser() user: User) {

        return this.tasksService.getTaskById(id, user)

    }

    @Patch(':id/status')
    updateTaskStatus(
        @Body() updateTaskStatusDto: UpdateTaskStatusDto,
        @Param('id') id: string,
        @GetUser() user: User
    ) {

        return this.tasksService.updateTaskStatus(updateTaskStatusDto, id, user)

    }

    @Delete(':id')
    deleteTask(@Param('id') id: string, @GetUser() user: User) {

        return this.tasksService.deleteTask(id, user)

    }

}
