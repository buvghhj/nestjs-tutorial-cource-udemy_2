import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        private readonly jwtService: JwtService
    ) { }

    public async register(authCredentialsDto: AuthCredentialsDto): Promise<void> {

        const { username, password } = authCredentialsDto

        const salt = await bcrypt.genSalt()

        const hashPass = await bcrypt.hash(password, salt)

        const user = this.userRepo.create({ username, password: hashPass })

        try {

            await this.userRepo.save(user)

        } catch (error) {

            if (error.code === '23505') {

                throw new ConflictException('Username already exists!')

            } else {

                throw new InternalServerErrorException()

            }

        }

    }

    public async login(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {

        const { username, password } = authCredentialsDto

        const user = await this.userRepo.findOne({ where: { username } })

        const comparePass = await bcrypt.compare(password, user.password)

        if (user && comparePass) {

            const accessToken: string = this.jwtService.sign({ username: username })

            return { accessToken }

        } else {

            throw new UnauthorizedException('Please check your login credentials!')

        }

    }

}
