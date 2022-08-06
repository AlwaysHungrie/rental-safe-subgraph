import { log } from '@graphprotocol/graph-ts'
import { acceptedAgreement, agreementEnded, approvedInterested, paidRent, paidRentFromSecurity, propertyRentSet, updatedInterestedRenter } from '../generated/Property/Property'
import { Property, User, InterestedTenant, RentPayment } from '../generated/schema'

export function handleRentSet(event: propertyRentSet): void {
  let propertyId = event.params.propertyAddress.toHex()
  let property = Property.load(propertyId)

  if (!property) {
    log.error('property not found', [])
    return;
  }

  property.rent = event.params.rent.toString();
  property.security = event.params.depositTime.toI32();

  property.save()
}

export function handleInterestedRenterUpdate(event: updatedInterestedRenter): void {
  const userId = event.params.renter.toHex()
  let user = User.load(userId)
  if (user == null) {
    user = new User(userId)
  }
  user.save()

  let property = Property.load(event.params.propertyAddress.toHex())
  if (!property) return;

  let i = InterestedTenant.load(event.params.renter.toHexString() + '-' + event.params.propertyAddress.toHex())
  if (i == null) {
    i = new InterestedTenant(event.params.renter.toHexString() + '-' + event.params.propertyAddress.toHex())
  }

  i.user = userId
  i.property = event.params.propertyAddress.toHex()
  i.time = event.params.t.toI32()

  i.save()
  property.save()
}


export function handleInterestedApproved(event: approvedInterested): void {
  const userId = event.params.renter.toHex()
  let user = User.load(userId)
  if (user == null) {
    user = new User(userId)
  }
  user.save()

  let property = Property.load(event.params.propertyAddress.toHex())
  if (!property) return;

  property.approvedTenant = userId;
  property.save()
}

export function handleAcceptAgreement(event: acceptedAgreement): void {
  const userId = event.params.renter.toHex()
  let user = User.load(userId)
  if (user == null) {
    user = new User(userId)
  }
  user.save()

  let property = Property.load(event.params.propertyAddress.toHex())
  if (!property) return;

  property.approvedTenant = null;
  property.currentTenant = userId;
  property.save()
}

export function handlePaidRent(event: paidRent): void {
  const rent = new RentPayment(event.transaction.hash.toHex())
  rent.user = event.params.renter.toHex()
  rent.property = event.params.propertyAddress.toHex()

  rent.amount = event.params.amount.toString()

  rent.fromSecurity = false
  rent.save()
}


export function handlePaidRentFromSecurity(event: paidRentFromSecurity): void {
  const rent = new RentPayment(event.transaction.hash.toHex())
  rent.user = event.params.renter.toHex()
  rent.property = event.params.propertyAddress.toHex()

  rent.amount = event.params.amount.toString()

  rent.fromSecurity = true
  rent.save()
}

export function handleAgreementEnded(event: agreementEnded): void {
  let property = Property.load(event.params.propertyAddress.toHex())
  if (!property) return;

  property.approvedTenant = null;
  property.currentTenant = null;
  property.save()
}