import { Friendship, FriendshipAttributes } from "../models/FriendshipModel"

class FriendshipDAO {
  async createFriendRequest(data: FriendshipAttributes): Promise<Friendship> {
    return Friendship.create(data);
  }

  async updateFriendshipStatus(
    id: number,
    status: "PENDING" | "ACCEPTED" | "DECLINED" | "BLOCKED"
  ): Promise<[number]> {
    return Friendship.update({ status }, { where: { id } });
  }

  async getFriendshipById(id: number): Promise<Friendship | null> {
    return Friendship.findByPk(id);
  }

  async deleteFriendship(id: number): Promise<void> {
    await Friendship.destroy({ where: { id } });
  }

  // Example: Fetch friendships by status
  async getFriendshipsByStatus(
    status: "PENDING" | "ACCEPTED" | "DECLINED" | "BLOCKED"
  ): Promise<Friendship[]> {
    return Friendship.findAll({ where: { status } });
  }
}

export default new FriendshipDAO();
