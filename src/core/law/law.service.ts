import { Injectable } from '@nestjs/common';
import { Law } from './entities/Laws';
import { Op } from 'sequelize';
import { Act } from './entities/Acts';

@Injectable()
export class LawService {
    async getLawsAndActs(lawIds: string[]): Promise<Array<Law>> {
        const result = await Law.findAll({
            where: {
                id: {
                    [Op.in]: lawIds,
                },
            },
            include: [Act],
            attributes: ['id', 'title', 'content', 'law_id', 'law_type'],
        });

        return result.map((r) => r.toJSON());
    }
}
