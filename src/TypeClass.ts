import { TypeFunction } from './TypeFunction';
import { TypeField } from './TypeField';
import { getAnnotation, getShortDescription } from './utils';

export class TypeClass {
  public constructor(
    private isGlobal: boolean,
    private name: string,
    private baseClass?: string,
    private staticFunctions: TypeFunction[] = [],
    private memberFunctions: TypeFunction[] = [],
    private memberFields: TypeField[] = [],
    private staticFields: TypeField[] = [],
    private constants: TypeField[] = [],
    private description?: string
  ) {}

  public addFunction(typeFunction: TypeFunction, isStatic = false) {
    if (isStatic) {
      this.staticFunctions.push(typeFunction);
    } else {
      this.memberFunctions.push(typeFunction);
    }
  }

  public addField(field: TypeField, isStatic = false) {
    if (isStatic) {
      this.staticFields.push(field);
    } else {
      this.memberFields.push(field);
    }
  }

  private getFunctionsLines(isStatic = false): string[] {
    const lines = [];
    for (const typeFunction of isStatic
      ? this.staticFunctions
      : this.memberFunctions) {
      if (!isStatic) {
        typeFunction.name = typeFunction.name.replace(
          `${this.name}`,
          `${this.name}Instance`
        );
      }
      lines.push(...typeFunction.getLines());
    }
    return lines;
  }

  private getFieldsLines(isStatic = false): string[] {
    const lines = [];
    for (const field of isStatic ? this.staticFields : this.memberFields) {
      lines.push(field.toAnnotation());
    }
    return lines;
  }

  private toAnnotation(isStatic = false) {
    const name = isStatic ? `Global${this.name}` : `${this.name}`;
    return getAnnotation(
      'class',
      `${name}${this.baseClass ? ' : ' + this.baseClass : ''}`,
      getShortDescription(this.description)
    );
  }

  private toDefinition(isStatic = false) {
    if (isStatic) {
      return `${this.name} = {}`;
    }
    return `local ${this.name}Instance = {}`;
  }

  public getLines() {
    const lines = [];

    lines.push(this.toAnnotation(false));
    lines.push(...this.getFieldsLines(false));
    lines.push(this.toDefinition(false));
    lines.push(...this.getFunctionsLines(false));

    lines.push(this.toAnnotation(true));
    lines.push(...this.getFieldsLines(true));
    lines.push(this.toDefinition(true));
    lines.push(...this.getFunctionsLines(true));

    return lines;
  }
}
