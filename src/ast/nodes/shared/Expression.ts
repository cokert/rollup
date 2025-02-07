import type { DeoptimizableEntity } from '../../DeoptimizableEntity';
import type { WritableEntity } from '../../Entity';
import type { HasEffectsContext, InclusionContext } from '../../ExecutionContext';
import type {
	NodeInteraction,
	NodeInteractionCalled,
	NodeInteractionWithThisArgument
} from '../../NodeInteractions';
import type { ObjectPath, PathTracker, SymbolToStringTag } from '../../utils/PathTracker';
import { UNKNOWN_PATH } from '../../utils/PathTracker';
import type { LiteralValue } from '../Literal';
import type SpreadElement from '../SpreadElement';
import type { IncludeChildren } from './Node';

export const UnknownValue = Symbol('Unknown Value');
export const UnknownTruthyValue = Symbol('Unknown Truthy Value');

export type LiteralValueOrUnknown =
	| LiteralValue
	| typeof UnknownValue
	| typeof UnknownTruthyValue
	| typeof SymbolToStringTag;

export interface InclusionOptions {
	/**
	 * Include the id of a declarator even if unused to ensure it is a valid statement.
	 */
	asSingleStatement?: boolean;
}

export class ExpressionEntity implements WritableEntity {
	included = false;

	deoptimizePath(_path: ObjectPath): void {}

	deoptimizeThisOnInteractionAtPath(
		{ thisArg }: NodeInteractionWithThisArgument,
		_path: ObjectPath,
		_recursionTracker: PathTracker
	): void {
		thisArg!.deoptimizePath(UNKNOWN_PATH);
	}

	/**
	 * If possible it returns a stringifyable literal value for this node that can be used
	 * for inlining or comparing values.
	 * Otherwise, it should return UnknownValue.
	 */
	getLiteralValueAtPath(
		_path: ObjectPath,
		_recursionTracker: PathTracker,
		_origin: DeoptimizableEntity
	): LiteralValueOrUnknown {
		return UnknownValue;
	}

	getReturnExpressionWhenCalledAtPath(
		_path: ObjectPath,
		_interaction: NodeInteractionCalled,
		_recursionTracker: PathTracker,
		_origin: DeoptimizableEntity
	): ExpressionEntity {
		return UNKNOWN_EXPRESSION;
	}

	hasEffectsOnInteractionAtPath(
		_path: ObjectPath,
		_interaction: NodeInteraction,
		_context: HasEffectsContext
	): boolean {
		return true;
	}

	include(
		_context: InclusionContext,
		_includeChildrenRecursively: IncludeChildren,
		_options?: InclusionOptions
	): void {
		this.included = true;
	}

	includeCallArguments(
		context: InclusionContext,
		parameters: readonly (ExpressionEntity | SpreadElement)[]
	): void {
		for (const argument of parameters) {
			argument.include(context, false);
		}
	}

	shouldBeIncluded(_context: InclusionContext): boolean {
		return true;
	}
}

export const UNKNOWN_EXPRESSION: ExpressionEntity =
	new (class UnknownExpression extends ExpressionEntity {})();
