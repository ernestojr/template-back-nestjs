import { DataSource, EntityTarget, Repository, DeepPartial } from 'typeorm';

export abstract class Seeder<T> {
    protected abstract entity: EntityTarget<T>;

    protected abstract build(): Promise<DeepPartial<T>[]>;

    async run(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(this.entity);

        for (const item of await this.build()) {
            const existingItem = await this.findExisting(repository, item);
            if (!existingItem) {
                await repository.save(item as DeepPartial<T>);
            }
        }
    }

    protected abstract findExisting(
        repository: Repository<T>,
        item: DeepPartial<T>
    ): Promise<T | null>;
}