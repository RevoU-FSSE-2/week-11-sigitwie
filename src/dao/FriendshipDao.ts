import { Friendship, FriendshipAttributes } from "../models/FriendshipModel";
import { Op } from "sequelize";

export type FriendshipStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "BLOCKED";

interface ResourceDAO {
  getById(id: number): Promise<any>;
  isOwner(resourceId: number, userId: number): Promise<boolean>;
}

class FriendshipDAO implements ResourceDAO {
  async createFriendRequest(data: FriendshipAttributes) {
    return Friendship.create(data);
  }

  async friendshipExistsBetween(
    userA: number,
    userB: number
  ): Promise<boolean> {
    const existingFriendship = await Friendship.findOne({
      where: {
        [Op.or]: [
          { requesterId: userA, requesteeId: userB },
          { requesterId: userB, requesteeId: userA },
        ],
      },
    });
    return !!existingFriendship;
  }

  async updateFriendshipStatus(id: number, status: FriendshipStatus) {
    return Friendship.update({ status }, { where: { id } });
  }

  // Implementing ResourceDAO.getById
  async getById(id: number) {
    return Friendship.findByPk(id);
  }

  // Implementing ResourceDAO.isOwner
  async isOwner(resourceId: number, userId: number): Promise<boolean> {
    const friendship = await this.getById(resourceId);
    if (friendship && friendship.requesteeId === userId) {
      return true;
    }
    return false;
  }

  async deleteFriendship(id: number) {
    await Friendship.destroy({ where: { id } });
  }

  async getUserFriendshipsByStatus(userId: number, status: FriendshipStatus) {
    return Friendship.findAll({
      where: {
        status,
        [Op.or]: [
          { requesterId: userId },
          { requesteeId: userId },
        ],
      },
    });
  }

}

export default new FriendshipDAO();
