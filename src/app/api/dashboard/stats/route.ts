import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [totalUsers, totalBlogs, activeBlogs, totalFeedbacks, blogsByMonth, categoryStats, recentBlogs, recentFeedbacks] =
      await Promise.all([
        prisma.user.count(),
        prisma.post.count(),
        prisma.post.count({ where: { status: "active" } }),
        prisma.feedback.count(),
        prisma.post.groupBy({
          by: ["createdAt"],
          where: {
            createdAt: { gte: sixMonthsAgo },
          },
          _count: true,
        }),
        prisma.post.groupBy({
          by: ["category"],
          _count: true,
        }),
        prisma.post.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            slug: true,
            createdAt: true,
            status: true,
          },
        }),
        prisma.feedback.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            post: {
              select: { title: true },
            },
          },
        }),
      ]);

    // Format blogsByMonth for chart (group by month/year)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyTrendMap: Record<string, number> = {};

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      monthlyTrendMap[label] = 0;
    }

    blogsByMonth.forEach((item) => {
      const d = new Date(item.createdAt);
      const label = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      if (monthlyTrendMap[label] !== undefined) {
        monthlyTrendMap[label] += item._count;
      }
    });

    const formattedMonthlyTrend = Object.entries(monthlyTrendMap).map(([name, count]) => ({
      name,
      count,
    }));

    return NextResponse.json({
      totalUsers,
      totalBlogs,
      activeBlogs,
      totalFeedbacks,
      monthlyTrend: formattedMonthlyTrend,
      categoryDistribution: categoryStats.map((item) => ({
        name: item.category,
        value: item._count,
      })),
      recentBlogs,
      recentFeedbacks,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
  }
}
