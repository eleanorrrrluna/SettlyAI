FROM jenkins/jenkins:lts-jdk17

USER root

# ---------- 基础工具 ----------
RUN apt-get update && apt-get install -y \
    curl ca-certificates gnupg lsb-release unzip jq \
    software-properties-common \
    && rm -rf /var/lib/apt/lists/*

# ---------- Docker CLI ----------
RUN apt-get update && apt-get install -y docker.io \
    && rm -rf /var/lib/apt/lists/* \
    && docker --version

# ---------- AWS CLI v2 (apt 方式) ----------
RUN apt-get update && \
    apt-get install -y awscli groff less jq && \
    aws --version

# ---------- Node 22 + pnpm ----------
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/* \
    && corepack enable \
    && corepack prepare pnpm@9 --activate \
    && pnpm --version \
    && node --version

# ---------- .NET SDK 8 ----------
RUN curl -fsSL https://dot.net/v1/dotnet-install.sh -o /usr/local/bin/dotnet-install.sh \
    && chmod +x /usr/local/bin/dotnet-install.sh \
    && /usr/local/bin/dotnet-install.sh --channel 8.0 \
    && ln -sf /root/.dotnet/dotnet /usr/local/bin/dotnet \
    && dotnet --info >/dev/null

# 可选：安装 SSM Agent（只在需要控制 Jenkins 容器本身时才加）
# RUN curl -fsSL https://s3.amazonaws.com/ec2-downloads-windows/SSMAgent/latest/debian_amd64/amazon-ssm-agent.deb -o /tmp/amazon-ssm-agent.deb \
#     && dpkg -i /tmp/amazon-ssm-agent.deb \
#     && rm /tmp/amazon-ssm-agent.deb \
#     && systemctl enable amazon-ssm-agent || true

# 让 Jenkins 用户能直接用所有工具
ENV PATH="/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/root/.dotnet:${PATH}"

USER jenkins