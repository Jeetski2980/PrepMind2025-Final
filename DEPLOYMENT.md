# 🚀 Deploying PrepMind to Render

This guide will help you deploy your PrepMind application to Render for free hosting.

## Prerequisites

- ✅ GitHub account with your code pushed to a repository
- ✅ Render account (free) - Sign up at [render.com](https://render.com)
- ✅ Together AI API key (already configured)

## Step-by-Step Deployment

### 1. Push Your Code to GitHub

First, make sure your code is in a GitHub repository:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit - PrepMind application"

# Add your GitHub repository as origin
git remote add origin https://github.com/yourusername/prepmind.git

# Push to GitHub
git push -u origin main
```

### 2. Create a New Web Service on Render

1. **Go to Render Dashboard**: Visit [dashboard.render.com](https://dashboard.render.com)

2. **Click "New +"** in the top right corner

3. **Select "Web Service"**

4. **Connect Your Repository**:

   - Choose "Connect a repository"
   - Select your GitHub account
   - Choose the repository containing your PrepMind code

5. **Configure the Service**:

   ```
   Name: prepmind (or your preferred name)
   Region: Oregon (US West) - recommended for free tier
   Branch: main
   Root Directory: . (leave empty for root)
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

6. **Set Instance Type**:
   - Choose "Free" for the free tier
   - 512MB RAM, 0.1 CPU

### 3. Configure Environment Variables

In the Render dashboard, scroll down to **Environment Variables** and add:

| Key                | Value                                                |
| ------------------ | ---------------------------------------------------- |
| `NODE_ENV`         | `production`                                         |
| `TOGETHER_API_KEY` | `tgp_v1_DW5qZ_ru5HyihziiZ7Um59gO-Dita3opk_vCNXCpncE` |

⚠️ **Important**: Make sure to use your actual Together AI API key

### 4. Deploy

1. **Click "Create Web Service"**
2. **Wait for deployment** (usually takes 5-10 minutes)
3. **Monitor the build logs** for any errors

### 5. Access Your Application

Once deployed, Render will provide you with a URL like:

```
https://prepmind.onrender.com
```

## 🔧 Configuration Files Included

The following files have been added to support Render deployment:

- **`render.yaml`**: Render service configuration
- **`.dockerignore`**: Optimizes build performance
- **`.env.example`**: Environment variable template

## 🚨 Important Notes

### Free Tier Limitations

- **Sleep Mode**: Free services sleep after 15 minutes of inactivity
- **Cold Starts**: First request after sleeping takes 10-30 seconds
- **750 hours/month**: Enough for personal projects and demos

### Performance Tips

- The app will "wake up" on first visit each day
- Consider upgrading to paid tier for production use
- Monitor usage in Render dashboard

### Security

- Environment variables are secure and encrypted
- Together AI API key is safely stored
- No sensitive data in repository

## 🛠️ Troubleshooting

### Build Fails

1. Check the build logs in Render dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version compatibility

### App Won't Start

1. Check if `npm start` works locally
2. Verify environment variables are set
3. Check server logs for errors

### AI Features Not Working

1. Verify `TOGETHER_API_KEY` is correctly set
2. Check API key has sufficient credits
3. Monitor API usage in Together AI dashboard

## 🔄 Automatic Deployments

Render automatically deploys when you push to your main branch:

```bash
# Make changes to your code
git add .
git commit -m "Update features"
git push origin main
# Render will automatically redeploy
```

## 📊 Monitoring

- **Dashboard**: Monitor app performance in Render dashboard
- **Logs**: View application logs in real-time
- **Metrics**: Track usage and performance

## 💡 Next Steps

After successful deployment:

1. **Custom Domain**: Add your own domain in Render settings
2. **SSL**: Automatic HTTPS is included
3. **Scaling**: Upgrade to paid tier for better performance
4. **Monitoring**: Set up notifications for downtime

## 🆘 Support

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Together AI Docs**: [docs.together.ai](https://docs.together.ai)
- **GitHub Issues**: Report issues in your repository

---

🎉 **Your PrepMind application is now live and accessible worldwide!**
