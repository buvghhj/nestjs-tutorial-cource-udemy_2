import { Exclude } from "class-transformer"
import { User } from "../../auth/entities/user.entity"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

enum TaskStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE'
}

@Entity()
export class Task {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    title: string

    @Column()
    description: string

    @Column()
    status: TaskStatus

    @ManyToOne(() => User, user => user.tasks, { eager: false })
    @Exclude({ toPlainOnly: true })
    user: User

}