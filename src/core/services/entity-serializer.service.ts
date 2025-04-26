import { Injectable } from "@nestjs/common";
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { EntityPaginationDto } from '../dtos/responses/entity-pagination.dto';

@Injectable()
export class EntitySerializerService {
    /**
     * Serializa una única entidad
     */
    single<T, V>(data: T, responseType: ClassConstructor<V>): V {
        return plainToInstance(responseType, data, {
            excludeExtraneousValues: true
        });
    }

    /**
     * Serializa un array de entidades
     */
    collection<T, V>(data: T[], responseType: ClassConstructor<V>): V[] {
        return plainToInstance(responseType, data, {
            excludeExtraneousValues: true
        });
    }

    /**
     * Serializa una respuesta paginada
     */
    pagination<T, V>(data: EntityPaginationDto<T>, responseType: ClassConstructor<V>): EntityPaginationDto<V> {
        return {
            records: this.collection(data.records, responseType),
            meta: data.meta
        };
    }
}
