import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { inject } from 'vue';

@Module({

  imports: [

    ConfigModule,

    TypeOrmModule.forFeature([User]),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({

      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: async (configService: ConfigService) => {

        return {

          secret: configService.get('JWT_SECRET'),

          signOptions: { expiresIn: 3600 }

        }

      }

    })

  ],

  controllers: [AuthController],

  providers: [

    AuthService,

    JwtStrategy

  ],

  exports: [

    JwtStrategy,

    PassportModule

  ]

})
export class AuthModule { }
