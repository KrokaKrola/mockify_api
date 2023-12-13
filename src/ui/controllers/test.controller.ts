import { Controller, Get, Query } from '@nestjs/common';
import { IsString } from 'class-validator';

class TestDto {
    @IsString()
    public hello: string;
}

@Controller()
export class TestController {
    @Get('/xyz')
    public async test(@Query() query: TestDto): Promise<unknown> {
        return {
            hello: 'world',
            ...query,
        };
    }
}
