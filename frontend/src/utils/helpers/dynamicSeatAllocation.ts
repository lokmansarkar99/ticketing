export const dynamicSeatAllocation = (coachClass: string) => {
  const left: any[] = [];
  const right: any[] = [];
  const lastRow: any[] = [];
  const middle: any[] = [];
  if (coachClass === "E_Class") {
    // E_Class: 2 left, 2 right, 41 seats in total, last row has 5 seats
    for (let i = 0; i < 9; i++) {
      left.push({ seat: `${String.fromCharCode(65 + i)}1` });
      left.push({ seat: `${String.fromCharCode(65 + i)}2` });
      right.push({ seat: `${String.fromCharCode(65 + i)}3` });
      right.push({ seat: `${String.fromCharCode(65 + i)}4` });
    }
    // Last row (5 seats)
    lastRow.push({ seat: `J1` });
    lastRow.push({ seat: `J2` });
    lastRow.push({ seat: `J3` });
    lastRow.push({ seat: `J4` });
    lastRow.push({ seat: `J5` });
  } else if (coachClass === "B_Class") {
    // B_Class: 1 left, 2 right, 28 seats in total, last row has 4 seats
    for (let i = 0; i < 8; i++) {
      left.push({ seat: `${String.fromCharCode(65 + i)}1` });
      right.push({ seat: `${String.fromCharCode(65 + i)}2` });
      right.push({ seat: `${String.fromCharCode(65 + i)}3` });
    }
    // Last row (4 seats)
    lastRow.push({ seat: `I1` });
    lastRow.push({ seat: `I2` });
    lastRow.push({ seat: `I3` });
    lastRow.push({ seat: `I4` });
  } else if (coachClass === "Sleeper") {
    for (let i = 0; i < 5; i++) {
      left.push({ seat: `L-${String.fromCharCode(65 + i)}1` }); // A1, B1, C1, etc.
      right.push(
        { seat: `L-${String.fromCharCode(65 + i)}2` }, // A2, B2, C2, etc.
        { seat: `L-${String.fromCharCode(65 + i)}3` } // A3, B3, C3, etc.
      );
    }

    // Upper Deck: A4-E4, A5-E5, A6-E6
    for (let i = 0; i < 5; i++) {
      left.push({ seat: `U-${String.fromCharCode(65 + i)}4` }); // A4, B4, C4, etc.
      right.push(
        { seat: `U-${String.fromCharCode(65 + i)}5` }, // A5, B5, C5, etc.
        { seat: `U-${String.fromCharCode(65 + i)}6` } // A6, B6, C6, etc.
      );
    }
    // Last row (3 seats)
  } else if (coachClass === "S_Class") {
    // Rows A to H with 3 seats each: A1, A2, A3 ... H1, H2, H3
    for (let i = 0; i < 8; i++) {
      const rowLetter = String.fromCharCode(65 + i); // A, B, C, ..., H
      left.push({ seat: `L-${rowLetter}1` });
      right.push({ seat: `L-${rowLetter}2` }, { seat: `L-${rowLetter}3` });
    }

    // Special I row with 4 seats: I1, I2 (middle), I3, I4
    left.push({ seat: `L-I1` }); // Left seat
    middle.push({ seat: `L-I2` }); // Middle seat (properly pushed here)
    right.push({ seat: `L-I3` }, { seat: `L-I4` }); // Right seats
    // Rows A to E (second set) with 3 seats each: A4, A5, A6 ... E4, E5, E6
    for (let i = 0; i < 5; i++) {
      const rowLetter = String.fromCharCode(65 + i); // A, B, C, D, E
      left.push({ seat: `U-${rowLetter}4` });
      right.push({ seat: `U-${rowLetter}5` }, { seat: `U-${rowLetter}6` });
    }
  }

  return { left, right, lastRow, middle };
};
