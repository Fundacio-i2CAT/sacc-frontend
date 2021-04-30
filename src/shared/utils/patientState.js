function countRepeatedElements(arr) {
  let a = [];
  let b = [];
  let prev;

  arr.sort();

  arr.forEach(element => {
    if (element !== prev) {
      a.push(element);
      b.push(1);
    } else {
      b[b.length - 1]++;
    }
    prev = element;
  });

  return {
    elementsAvailable: a,
    numberOfTimesRepeated: b
  };
}

function interpolateArrays(obj1, obj2) {
  let iarr2 = [];
  let arr2Index = 0;

  obj1.elementsAvailable.forEach(element => {
    if (element === obj2.elementsAvailable[arr2Index]) {
      iarr2.push(obj2.numberOfTimesRepeated[arr2Index]);
      arr2Index++;
    } else {
      iarr2.push(0);
    }
  });

  return {
    elementsAvailable: obj1.elementsAvailable,
    numberOfTimesRepeated: iarr2
  };
}

export function calculateEndUserState(
  totalRequested,
  totalRejected,
  totalGranted,
  totalRevoked
) {
  let tReq = countRepeatedElements(totalRequested);
  let tRej = countRepeatedElements(totalRejected);
  let tGran = countRepeatedElements(totalGranted);
  let tRev = countRepeatedElements(totalRevoked);

  let itRej = interpolateArrays(tReq, tRej);
  let itGran = interpolateArrays(tReq, tGran);
  let itRev = interpolateArrays(tReq, tRev);

  let rejected = [];
  let granted = [];
  let revoked = [];

  for (let i = 0; i < tReq.elementsAvailable.length; i++) {
    if (
      tReq.numberOfTimesRepeated[i] === itGran.numberOfTimesRepeated[i] &&
      tReq.numberOfTimesRepeated[i] === itRev.numberOfTimesRepeated[i]
    ) {
      revoked.push(tReq.elementsAvailable[i]);
    } else if (
      tReq.numberOfTimesRepeated[i] === itRej.numberOfTimesRepeated[i]
    ) {
      rejected.push(tReq.elementsAvailable[i]);
    } else if (
      tReq.numberOfTimesRepeated[i] === itGran.numberOfTimesRepeated[i] &&
      tReq.numberOfTimesRepeated[i] > itRev.numberOfTimesRepeated[i]
    ) {
      granted.push(tReq.elementsAvailable[i]);
    } else if (
      tReq.numberOfTimesRepeated[i] ===
      itGran.numberOfTimesRepeated[i] + itRej.numberOfTimesRepeated[i]
    ) {
      granted.push(tReq.elementsAvailable[i]);
    }
  }

  let requested = tReq.elementsAvailable
    .filter(e => !granted.includes(e))
    .filter(e => !rejected.includes(e))
    .filter(e => !revoked.includes(e));

  return {
    requested,
    rejected,
    granted,
    revoked
  };
}
