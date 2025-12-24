export const getPropertyValues = <T>(
  object: any,
  propertyName: string
): T[] => {
  // INITIALIZE AN ARRAY TO STORE THE VALUES
  const values: T[] = [];

  // HELPER FUNCTION TO RECURSIVELY TRAVERSE THE OBJECT
  const traverse = (targetObject: any): void => {
    // CHECK IF THE CURRENT OBJECT IS DEFINED
    if (targetObject && typeof targetObject === "object") {
      // ITERATE OVER EACH KEY IN THE OBJECT
      for (const key in targetObject) {
        // CHECK IF THE CURRENT KEY IS THE PROPERTY WE'RE INTERESTED IN
        if (key === propertyName) {
          // IF SO, ADD THE VALUE TO THE ARRAY
          values?.push(targetObject[key]);
        }
        // IF THE CURRENT VALUE IS ANOTHER OBJECT, RECURSIVELY TRAVERSE IT
        if (typeof targetObject[key] === "object") {
          traverse(targetObject[key]);
        }
      }
    }
  };

  // START TRAVERSING THE OBJECT
  traverse(object || {});

  // RETURN THE ARRAY OF VALUES

  if (values[0] === "") {
    return [];
  } else {
    return values;
  }
};
