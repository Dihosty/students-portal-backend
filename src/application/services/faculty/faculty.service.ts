import {
  CreateFacultyDto,
  FacultyDto,
  IFacultyRepository,
  UpdateFacultyDto,
} from '@domain/core';
import { Faculty } from '@domain/entities';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class FacultyService {
  constructor(
    @Inject(IFacultyRepository)
    private readonly facultyRepository: IFacultyRepository,
  ) {}

  private toDto(faculty: Faculty): FacultyDto {
    return {
      id: faculty.id!,
      name: faculty.name,
      createdAt: faculty.createdAt!,
    };
  }

  async create(dto: CreateFacultyDto): Promise<FacultyDto> {
    const existing = await this.facultyRepository.findByName(dto.name);
    if (existing) {
      throw new ConflictException('Faculty with this name already exists');
    }

    const created = await this.facultyRepository.create(
      new Faculty(undefined, dto.name),
    );
    return this.toDto(created);
  }

  async findAll(): Promise<FacultyDto[]> {
    const faculties = await this.facultyRepository.findAll();
    return faculties.map((faculty) => this.toDto(faculty));
  }

  async findById(id: string): Promise<FacultyDto> {
    const faculty = await this.facultyRepository.findById(id);
    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${id} not found`);
    }
    return this.toDto(faculty);
  }

  async update(id: string, dto: UpdateFacultyDto): Promise<FacultyDto> {
    const existing = await this.facultyRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Faculty with ID ${id} not found`);
    }

    if (dto.name && dto.name !== existing.name) {
      const byName = await this.facultyRepository.findByName(dto.name);
      if (byName && byName.id !== id) {
        throw new ConflictException('Faculty with this name already exists');
      }
    }

    const updated = await this.facultyRepository.update(
      id,
      new Faculty(id, dto.name ?? existing.name, existing.createdAt),
    );
    return this.toDto(updated);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.facultyRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Faculty with ID ${id} not found`);
    }
    await this.facultyRepository.delete(id);
  }
}

