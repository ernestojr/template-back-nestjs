import { Injectable } from "@nestjs/common";
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { EntityPaginationResponse } from '../interfaces/entity-pagination.interface';

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
    pagination<T, V>(data: EntityPaginationResponse<T>, responseType: ClassConstructor<V>): EntityPaginationResponse<V> {
        return {
            records: this.collection(data.records, responseType),
            meta: data.meta
        };
    }
}
