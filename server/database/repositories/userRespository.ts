import { User } from "@prisma/client";
import prisma from "~/server/database/client";
import { IUser } from '~/types/IUser';
import { ISubscription } from "~/types/ISubscription";

export async function getUserByEmail(emailOrEmail: string): Promise<User|null> {
  return await prisma.user.findFirst({
    where: {
      OR:
        [
          { email: emailOrEmail },
          { username: emailOrEmail },
        ]
    }
  })
}

export async function getUserByUserName(username: string) {
  return await prisma.user.findUnique({
    where: {
      username: username,
    },
    select: {
      id: true,
      username: true,
    },
  })
}

export async function createUser(data: IUser) {
  const user = await prisma.user.create({
    data: {
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      loginType: data.loginType,
      password: data.password,
    },
  })

  return user
}

export async function getUserById(id: number) {
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      username: true,
      email: true,
      stripeCustomerId: true,
    },
  })
}

export async function getUserByStripeCustomerId(stripeCustomerId: string) {
  return await prisma.user.findFirst({
    where: {
      stripeCustomerId: stripeCustomerId,
    },
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      phone: true,
      email: true,
      stripeCustomerId: true,
    },
  })
}

export async function getSubscriptionById(stripeId: string) {
  return await prisma.subscription.findFirst({
    where: {
      stripeId: stripeId,
    }
  })
}

export async function updateStripeCustomerId(data: IUser) {
  return await prisma.user.update({
    where: { email: data.email },
    data: {
      stripeCustomerId: data.stripeCustomerId,
    }
  })
}

export async function updateSubscription(data: ISubscription) {
  return await prisma.subscription.update({
    where: {
      stripeId: data.stripeId
    },
    data: {
      stripeStatus: data.stripeStatus,
      stripePriceId: data.stripePriceId,
      quantity: data.quantity,
      trialEndsAt: data.trialEndsAt,
      endsAt: data.endsAt,
      lastEventDate: data.lastEventDate,
      startDate: data.startDate
    }
  
  })
}

export async function createSubscription(data: ISubscription) {
  return await prisma.subscription.create({
    data: {
      userId: data.userId,
      stripeId: data.stripeId,
      stripeStatus: data.stripeStatus,
      stripePriceId: data.stripePriceId,
      quantity: data.quantity,
      trialEndsAt: data.trialEndsAt,
      endsAt: data.endsAt,
      lastEventDate: data.lastEventDate,
      startDate: data.startDate
    }
  })
}


