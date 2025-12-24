export const groupByProperties = <T>(
  array: T[],
  properties: (keyof T)[]
): any[] => {
  const groupedData: { [key: string]: any } = {};

  array.forEach((item) => {
    const key = properties.map((propertyName) => item[propertyName]).join("-");
    if (!groupedData[key]) {
      // Create a new group object
      const group: Partial<any> = {};
      properties.forEach((propertyName) => {
        // Typecast to ensure property assignment
        (group as any)[propertyName] = item[propertyName];
      });
      group.groupData = [];
      groupedData[key] = group as any;
    }
    groupedData[key].groupData.push(item as any);
  });

  return Object.values(groupedData);
};
