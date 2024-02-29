export const MessageLogging: MethodDecorator = (
  _target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
) => {
  const targetMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const logFn = (this as any).logger ?? console;
    void descriptor;
    logFn.debug(
      `Calling method: ${String(propertyKey)} with message: ${JSON.stringify(args)} `,
    );
    return targetMethod.apply(this, args);
  };

  return descriptor;
};
